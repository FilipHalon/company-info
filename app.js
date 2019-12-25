const table = document.querySelector(".table");
const tableRowCreate = obj => {
    return `<div class="row">
                <span>${obj.id}</span>
                <span>${obj.name}</span>
                <span>${obj.city}</span>
                <span>${obj.totalIncome}</span>
                <span>${obj.avgIncome}</span>
                <span>${obj.lastMonthIncome}</span>
            </div>`;
}

const getCompanyInfo = async () => {
    try {
        const companyDataRes = await fetch('https://recruitment.hal.skygate.io/companies')
        if (companyDataRes.ok) {
            const jsonCompanyDataRes = await companyDataRes.json();
            console.log(jsonCompanyDataRes);
            jsonCompanyDataRes.forEach(async comp => {
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
                        if (incomeDate.getFullYear() == today.getFullYear() && incomeDate.getMonth() == today.getMonth() - 1 || incomeDate.getMonth() == 12 && today.getMonth() == 1 && today.getFullYear() - 1 == incomeDate.getFullYear()) {
                            lastMonthIncome += parseInt(val['value']);
                        };
                    });
                    comp['totalIncome'] = totalIncome;
                    comp['lastMonthIncome'] = lastMonthIncome;
                    comp['avgIncome'] = totalIncome/comp['incomes'].length;
                    console.log(comp);
                    table.appendChild(tableRowCreate(comp));
                }
                else {
                    throw Error('Income data could not be retrieved.')
                }
            })
        }
        else {
            throw Error('Company data could not be retrieved.')
        }
    }
    catch (err) {
        console.log(err)
    };
};

getCompanyInfo();