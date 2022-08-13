const { numberWithCommas } = require('../../../utils');
const userModel = require('../../db/schemas/userSchema');

module.exports = {
    execute : async int => {
        if(!int.isSelectMenu()) return false;

        if(!int.values[0].startsWith('inv-'))
            return false;

        userModel.findOne({ discord_id: int.user.id }, async(err, res) => {
            if(err) return console.log(err);
        
            if(int.values[0].startsWith('inv-fish-')) {
                let id = int.values[0].split('inv-fish-')[1];
                
                if(!res.fishes[id])
                    return int.reply({ content: 'That slot of your inventory was deleted.', ephemeral: true });
                
                let name = res.fishes[id].name;
                let money = parseInt(res.fishes[id].price);
                let count = parseInt(res.fishes[id].count); 
                
                res.money = res.money + (money * count);                
                await int.reply({ content: `You just sold out ${name} [${count}x] for $${numberWithCommas(money * count)}.`, ephemeral: true });
                res.fishes.splice(res.fishes[id], 1);
            }

            if(int.values[0].startsWith('inv-wallpaper-')) {
                var id = int.values[0].split('inv-wallpaper-')[1];
            
                var wallpaper = res.wallpapers.find((w) => w.active == true);
                var Id = res.wallpapers.indexOf(wallpaper);
                
                res.wallpapers[Id].active = false;
                res.wallpapers[id].active = !res.wallpapers[id].active;
                
                await int.reply({content: `You turned ${res.wallpapers[id].active ? ('**on**') : ('**off**')} ${res.wallpapers[id].name}'s card wallpaper.`, ephemeral: true}); 
            }    

            res.save();    
        })
    }
}