const userModel = require('../../db/schemas/userSchema');
const { wallpapers } = require('../../commands/store');
const utils = require('../../../utils');


module.exports = {
    execute : async int => {
        if(!int.isSelectMenu()) return;

        if(!int.values[0].startsWith('shop_wallpapers_'))
            return false;

        var ids = [];
        var names = [];
        var moneys = 0;
        var shards = 0;
        await int.deferUpdate();
        
        int.values.forEach((val) => {
            ids.push(val.split('shop_wallpapers_')[1] - 1);
        });

        userModel.findOne({ discord_id: int.user.id }, async(err, res) => {
            for(const id of ids) 
            {
                if(err) return console.log(err);
    
                if(wallpapers.data[id].shard < res.shards)
                {       
                    shards += wallpapers.data[id].shard; 
                    res.shards = res.shards - wallpapers.data[id].shard;
                    buyMethod = 'shards';
                }
            
                else {
                    if(wallpapers.data[id].money > res.money)
                        return int.followUp({ content :`You don't have a sufficient amount of shards or money.`, ephemeral: true });    
     
                    res.money = res.money - wallpapers.data[id].money;
                    moneys += wallpapers.data[id].money;
                    buyMethod = 'money';
                }
                
                if(res.wallpapers.find(wallpaper => wallpaper.name === wallpapers.data[id].name))
                    return int.followUp({ content: `You already **${wallpapers.data[id].name}** own this wallpaper. Please check this by typing **/inventory**.`});

                names.push(wallpapers.data[id].name);
                res.wallpapers.push(wallpapers.data[id]);

                if(!res.wallpapers.find(wallpaper => wallpaper.active === true && wallpaper.name !== 'default'))
                    wallpapers.data[id].active = true;        
            };             
    
            names = names.join(', ');
            res.save();
            int.followUp({ content: `☑️ You successfully bought ${names} for $${utils.numberWithCommas(moneys)} and ${utils.numberWithCommas(shards)} shards.`, embeds: [], components: [], ephemeral: true});                        
        });
   }
        
}