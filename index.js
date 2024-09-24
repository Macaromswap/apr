const axios = require('axios')
const fs = require('fs');
const INFO_POOLS = 'https://info-api.macaron.xyz/pair/200901/pools'


async function getPoolAPR() {
    const res = await axios.get(INFO_POOLS)
    let dataApr = {}
    if (res.data.statusCode === 200) {
        const pools = res.data.data
        for (const pool of pools) {
            const { day_volume, week_volume, month_volume, tvl, charge_pecent, pair_address } = pool;
            if (Number(tvl) <= 0) {
                pool.apr = '0.00'
            } else {
                const pecent = Number(charge_pecent)
                const aprd = Number(day_volume) * pecent * 365 / Number(tvl);
                const aprw = Number(week_volume) / 7 * pecent * 365 / Number(tvl);
                const aprm = Number(month_volume) / 30 * pecent * 365 / Number(tvl);
                const apr = Math.max(aprd, aprw, aprm) * 100
                const poolAPR = apr * 2 / 3;
                pool.apr = poolAPR;
            }
            dataApr[pair_address] = pool
        }
    }
    fs.writeFileSync('./apr.json', JSON.stringify(dataApr))
}

getPoolAPR()