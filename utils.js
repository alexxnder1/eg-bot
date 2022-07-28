module.exports = {
    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    returnLevelUpPoints(level) {
        return (level * 2502);
    }
}