import React, {Component} from 'react';
import Axios from 'axios';
import SearchInput from './SearchInput';
import TableHead from './TableHead';
import TableRow from './TableRow';
import PaginationButton from './PaginationButton'

export default class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allCompanies: [],
            companies: [],
            sortBy: '',
            sortOrder: '',
            pageNum: 1,
            pageItems: 15
        };
        this.handleSort = this.handleSort.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
    }

    getCompanyInfo = async () => {
        try {
            const companyDataRes = await Axios.get('https://recruitment.hal.skygate.io/companies')
            if (companyDataRes.statusText) {
                return await companyDataRes.data;
            }
            else {
                throw Error('Company data could not be retrieved.')
            };
        }
        catch (err) {
            console.log(err)
        };
    }

    getIncomeInfo = async comp => {
        const incomeInfoRes = await Axios.get(`https://recruitment.hal.skygate.io/incomes/${comp['id']}`)
        if (incomeInfoRes.statusText) {
            const jsonIncomeInfoRes = await incomeInfoRes.data;
            comp['incomes'] = jsonIncomeInfoRes['incomes'];
            const today = new Date();
            const todayYear = today.getFullYear();
            const todayMonth = today.getMonth() + 1;
            let totalIncome = 0;
            let lastMonthIncome = 0;
            comp['incomes'].forEach(item => {
                const itemValue = parseFloat(item['value'])
                totalIncome += itemValue;
                const incomeDate = new Date(item['date']);
                const incomeYear = incomeDate.getFullYear();
                const incomeMonth = incomeDate.getMonth() + 1;
                if ((incomeYear === todayYear && incomeMonth === todayMonth - 1) || (incomeYear === todayYear - 1 && (incomeMonth === 12 && todayMonth === 1))) {
                    lastMonthIncome += itemValue;
                };
            });
            comp['totalIncome'] = totalIncome === 0 ? 0 : totalIncome.toFixed(2);
            comp['lastMonthIncome'] = lastMonthIncome === 0 ? 0 : lastMonthIncome.toFixed(2);
            comp['avgIncome'] = (totalIncome/comp['incomes'].length).toFixed(2);
            return comp;
        }
        else {
            throw Error('Income data could not be retrieved.')
        };
    }

    collectIncomeInfo = async (res) => {
        const { allCompanies, companies } = this.state;
        for (let comp of res) {
            let fullInfo = await this.getIncomeInfo(comp)
            allCompanies.push(fullInfo);
            companies.push(fullInfo);
            this.setState({
                allCompanies: allCompanies,
                companies: companies
            })
        }
    }

    componentDidMount() {
            this.getCompanyInfo().then(res => {
                this.collectIncomeInfo(res)
            }
        )
    }

    handleSort(e) {
        let sortBy = this.state.sortBy;
        let sortOrder = this.state.sortOrder;
        const target = e.target;
        const columnLabel = target.id;
        if (sortBy !== columnLabel) {
            sortBy = columnLabel;
            sortOrder = 'asc';
        }
        else {
            sortOrder === "asc" ? sortOrder = "desc" : sortOrder = "asc";
        };
        const rows = this.state.companies;
        rows.sort(this.compare(sortBy, sortOrder))
        this.setState({
            companies: rows,
            sortBy: sortBy,
            sortOrder: sortOrder
        })
    }

    compare(sortBy, sortOrder) {
        return (a, b) => {
            let order = 0;
            if (a[sortBy] < b[sortBy]) {
                order = -1;
            }
            else if (a[sortBy] > b[sortBy]) {
                order = 1;
            }
            return sortOrder === 'desc' ? order * -1 : order;
        }
    }

    handleSearch(e) {
        const searchPhrase = e.target.value;
        const filteredCompanies = this.filter(searchPhrase);
        this.setState({
            companies: filteredCompanies
        })
    }

    filter(searchPhrase) {
        searchPhrase = new RegExp(searchPhrase);
        const filteredCompanies = [];
        const {allCompanies} = this.state;
        allCompanies.forEach(company => {
            for (let key in company) {
                let prop = company[key];
                if (typeof prop === 'number') {
                    prop = prop.toString();
                }
                if (searchPhrase.test(prop)) {
                    filteredCompanies.push(company);
                    break;
                }                            
            }
        })
        console.log(filteredCompanies);
        return filteredCompanies
    }

    handlePagination(e) {
        const pageNum = parseInt(e.target.innerText);
        this.setState({
            pageNum: pageNum
        })
    }

    render() {
        let {companies} = this.state;
        const {pageNum, pageItems} = this.state;
        const numberOfPages = Array.from({length: Math.ceil((companies.length)/pageItems)}, (v, i) => i+1);
        // great many thanks to Piotr Berebecki for inspiring this solution https://stackoverflow.com/questions/40232847/how-to-implement-pagination-in-reactjs
        const lastCompanyInRange = pageNum * pageItems;
        const firstCompanyInRange = lastCompanyInRange - pageItems;
        companies = companies.slice(firstCompanyInRange, lastCompanyInRange);
        return (
            <section className="table">
                <div className="inputArea">
                    <SearchInput handleChange={this.handleSearch} />
                </div>
                <div className="table">
                    <TableHead handleClick={this.handleSort} />
                    {companies.map(company => <TableRow key={company.id} company={company} />)}
                </div>
                <div className="buttons">
                    {numberOfPages.map(num => <PaginationButton key={num} pageNumber={num} handleClick={this.handlePagination} />)}
                </div>
            </section>
            );
    }
}
