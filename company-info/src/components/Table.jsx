import React, {Component} from 'react';
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
            sortBy: null,
            sortOrder: null,
            currentPage: 1,
        };
        // this.getCompanyInfo = this.getCompanyInfo.bind(this);
        // this.getIncomeInfo = this.getIncomeInfo.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
    }

    getCompanyInfo = async () => {
        try {
            const companyDataRes = await fetch('https://recruitment.hal.skygate.io/companies')
            if (companyDataRes.ok) {
                const jsonCompanyDataRes = await companyDataRes.json();
                return await jsonCompanyDataRes;
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
        const incomeInfoRes = await fetch(`https://recruitment.hal.skygate.io/incomes/${comp['id']}`)
        if (incomeInfoRes.ok) {
            const jsonIncomeInfoRes = await incomeInfoRes.json();
            comp['incomes'] = jsonIncomeInfoRes['incomes'];
            const today = new Date();
            let totalIncome = 0;
            let lastMonthIncome = 0;
            comp['incomes'].forEach(val => {
                totalIncome += parseInt(val['value']);
                const incomeDate = new Date(val['date']);
                if ((incomeDate.getFullYear() == today.getFullYear() && incomeDate.getMonth() == today.getMonth() - 1) || (incomeDate.getMonth() == 12 && today.getMonth() == 1 && today.getFullYear() - 1 == incomeDate.getFullYear())) {
                    lastMonthIncome += parseInt(val['value']);
                };
            });
            comp['totalIncome'] = totalIncome;
            comp['lastMonthIncome'] = lastMonthIncome;
            comp['avgIncome'] = totalIncome/comp['incomes'].length;
            // console.log(comp);
            return comp;
        }
        else {
            throw Error('Income data could not be retrieved.')
        };
    }

    collectIncomeInfo = async (res) => {
        const companies = []; 
        for (let comp of res) {
            companies.push(await this.getIncomeInfo(comp))
        }
        return companies;
    }

    componentDidMount() {
        this.getCompanyInfo()
            .then(res => (this.setState({
                allCompanies: res,
                companies: res
            })));

        // this.getCompanyInfo()
        //     .then(res => {
        //         return this.collectIncomeInfo(res);
        //     })
        //     .then(companies => {
        //         console.log(companies);
        //         this.setState({companies: companies})
        //     })

    }

    handleSort(e) {
        const sortBy = this.state.sortBy;
        let sortOrder = this.state.sortOrder;
        const target = e.target;
        const columnLabel = target.id;
        if (sortBy !== columnLabel) {
            this.setState({
                sortBy: columnLabel,
                sortOrder: "asc"
            });
        }
        else {
            sortOrder === "asc" ? sortOrder = "desc" : sortOrder = "asc";
            this.setState({
                sortOrder: sortOrder
            });
        };
        const rows = this.state.companies;
        rows.sort(this.compare(this.state.sortBy, this.state.sortOrder))
        this.setState({
            companies: rows
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
        const pageNumber = parseInt(e.target.innerText);
        console.log(pageNumber);
        this.setState({
            currentPage: pageNumber
        })
    }

    render() {
        const {companies} = this.state;
        const numberOfPages = Array.from({length: Math.ceil((companies.length)/50)}, (v, i) => i+1);
        return (
            <section className="table">
                <SearchInput handleChange={this.handleSearch} />
                <TableHead handleClick={this.handleSort} />
                {companies.map(company => <TableRow key={company.id} company={company} />)}
                {numberOfPages.map(num => <PaginationButton key={num} pageNumber={num} handleClick={this.handlePagination} />)}
            </section>
            );
    }
}
