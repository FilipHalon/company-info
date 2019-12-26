import React, {Component} from 'react';
import SearchInput from './SearchInput';
import TableHead from './TableHead';
import TableRow from './TableRow';

export default class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companies: [],
            sort: null,
            sortBy: null
        };
        this.getCompanyInfo = this.getCompanyInfo.bind(this);
        this.getIncomeInfo = this.getIncomeInfo.bind(this);
        this.handleSort = this.handleSort.bind(this);
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
            const today = new Date;
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
            .then(res => (this.setState({companies: res})));

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
        // const sort = this.state.sort;
        // const sortBy = this.state.sortBy;
        const target = e.target;
        const columnLabel = target.id;
        if (columnLabel === "head-id") {
            this.setState({
                sortBy: "head-id",
                sort: "asc"
            });
            console.log(this.state.sort, this.state.sortBy);
            const sorted = this.applySorting(this.state.sortBy, this.state.sort);
            console.log(sorted);
            this.setState({
                companies: sorted
            })
        }
        // else if (columnLabel === "head-name") {

        // }
        // else if (columnLabel === 'head-city') {

        // }
        // else if (columnLabel === 'head-total-income') {

        // }
        // else if (columnLabel === 'head-avg-income') {

        // }
        // else if (columnLabel === 'head-last-month-income') {

        // }
    }

    compare(sortBy, sort) {
        return (a, b) => {
            let order = 0;
            if (a[sortBy] < b[sortBy]) {
                order = -1;
            }
            else if (a[sortBy] > b[sortBy]) {
                order = 1;
            }
            return sort === 'desc' ? order * -1 : order;
        }
    }

    applySorting(sortBy, sort) {
        const rows = this.state.companies;
        if (sortBy === "head-id") {
            rows.sort(this.compare('id', sort))
        }
        return rows;
    }

    render() {
        return (
            <section className="table">
                <SearchInput />
                <TableHead handleClick = {this.handleSort} />
                {this.state.companies.map(company => (<TableRow company={company} />))}
            </section>
            );
    }
}