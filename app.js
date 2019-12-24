const getCompanyInfo = async () => {
    try {
        const companyDataRes = await fetch('https://recruitment.hal.skygate.io/companies')
        if (companyDataRes.ok) {
            const jsonCompanyDataRes = await companyDataRes.json();
            console.log(jsonCompanyDataRes);
            jsonCompanyDataRes.forEach(async ob => {
                const incomeInfoRes = await fetch(`https://recruitment.hal.skygate.io/incomes/${ob['id']}`)
                if (incomeInfoRes.ok) {
                    const jsonIncomeInfoRes = await incomeInfoRes.json();
                    // console.log(jsonIncomeInfoRes);
                    ob['incomes'] = jsonIncomeInfoRes['incomes'];
                    console.log(ob);
                }
            })
        }
        else {
            throw Error('Request did not succeed.')
        }
    }
    catch (err) {
        console.log(err)
    };
};

getCompanyInfo();