var Arena = function(ctx) {
    this.width_arena = 24;
    this.height_arena = 24;
    this.monsters = [];
    this.player = null;
    this.ctx = ctx;
    this.gameState = "";
    var _self = this;
    
    var unitPixel = 40;

    var imgGrass = document.getElementById('grass');
    var imgWall = document.getElementById('wall');
    var imgTree = document.getElementById('tree');
    var imgMonster = document.getElementById('monster');
    var imgPlayer = document.getElementById('player');
    var imgPosion = document.getElementById('posion');

    this.init = function(){
        //assign monsters and player
        for(var i = 0 ; i < _self.height_arena ; i++){
            for(var j = 0 ; j < _self.width_arena ; j++){
                if(arena_data[i][j] == 3)
                {
                    _self.player = new Player(j,i);
                }
                
                else if(arena_data[i][j] == 4)
                {
                    _self.monsters.push(new Monster(j,i));
                }
            }
        }
        _self.drawArena();

        /////////////////////////////////////////
        window.addEventListener('attack-player',function(e){
            _self.player.getAttack(e.detail.attack);
        })

        window.addEventListener('attack-monster',function(e){
            //attack monster event
            var playerX = _self.player.x;
            var playerY = _self.player.y;

            var attackPosX = playerX;
            var attackPosY = playerY;

            switch(e.detail.direction){
                case "up":
                    attackPosY--;
                    break;
                case "down":
                    attackPosY++;
                    break;
                case "left":
                    attackPosX--;
                    break;
                case "right":
                    attackPosX++;
                    break;
            }

            console.log(attackPosX, attackPosY)

            for(var i = 0 ; i < _self.monsters.length ; i++){
                var m_info = _self.monsters[i];
                if(m_info.x == attackPosX && m_info.y == attackPosY){
                    _self.monsters[i].getAttack(e.detail.attack);
                }
            }

            var livingMonsters = 0;
            for(var i = 0 ; i < _self.monsters.length ; i++){
                var m_info = _self.monsters[i];
                if(m_info.bAlive == true) livingMonsters++;
            }

            if(livingMonsters == 0)
            {
                console.log('you won the game');
                setTimeout(() => {
                    _self.gameState = "win";
                }, 1000);
            }
        })

        window.addEventListener('game-over',function(){
            setTimeout(() => {
                _self.gameState = "game-over";
            }, 1000);
        })
    }

    this.drawArena = function(){
        _self.ctx.clearRect(0,0,960,960);
        if(_self.gameState == "")
        {
            for(var i = 0 ; i < _self.height_arena ; i++){
                for(var j = 0 ; j < _self.width_arena ; j++){
                    switch(arena_data[i][j])
                    {
                        case 0:
                            _self.ctx.drawImage(imgGrass, j*unitPixel, i*unitPixel, unitPixel, unitPixel);
                            break;
                        case 1:
                            _self.ctx.drawImage(imgWall, j*unitPixel, i*unitPixel, unitPixel, unitPixel);
                            break;
                        case 2:
                            _self.ctx.drawImage(imgTree, j*unitPixel, i*unitPixel, unitPixel, unitPixel);
                            break;
                        case 3:
                            _self.ctx.drawImage(imgPlayer, j*unitPixel, i*unitPixel, unitPixel, unitPixel);
                            //draw health bar
                            _self.ctx.strokeStyle = "#000";
                            _self.ctx.fillStyle = "#f00";

                            _self.ctx.beginPath();
                            _self.ctx.rect(j*unitPixel, i*unitPixel-6, unitPixel, 6);
                            _self.ctx.fill();
                            _self.ctx.lineWidth = 0.5;
                            _self.ctx.stroke();

                            _self.ctx.beginPath();
                            _self.ctx.fillStyle = "#0f0";
                            _self.ctx.rect(j*unitPixel+0.5, i*unitPixel-5.5, unitPixel*(_self.player.HP/_self.player.MHP), 5);
                            _self.ctx.fill();
                            _self.ctx.stroke();
                            break;
                        case 5:
                            _self.ctx.drawImage(imgPosion, j*unitPixel, i*unitPixel, unitPixel, unitPixel);
                            break;
                    }
                }
            }

            //draw monsters
            for(var i = 0 ; i < _self.monsters.length ; i++){
                var m_info = _self.monsters[i];
                if(m_info.bAlive == true){
                    _self.ctx.drawImage(imgMonster, m_info.x*unitPixel, m_info.y*unitPixel, unitPixel, unitPixel);

                    _self.ctx.beginPath();
                    _self.ctx.fillStyle = "#f00";
                    _self.ctx.rect(m_info.x*unitPixel, m_info.y*unitPixel-6, unitPixel, 6);
                    _self.ctx.fill();
                    _self.ctx.lineWidth = 0.5;
                    _self.ctx.stroke();

                    _self.ctx.beginPath();
                    _self.ctx.fillStyle = "#0f0";
                    _self.ctx.rect(m_info.x*unitPixel+0.5, m_info.y*unitPixel-5.5, unitPixel*(m_info.HP/m_info.MHP), 5);
                    _self.ctx.fill();
                    _self.ctx.stroke();
                }
            }

            //draw help
            ctx.font = "20px Comic Sans MS";
            ctx.fillStyle = "red";
            ctx.fillText("Attack : A            Move : Arrow keys", 10, 945);
            setTimeout(() => {
                _self.drawArena();
            }, 50);
        }
        else if(_self.gameState == "game-over")
        {
            ctx.font = "80px Comic Sans MS";
            ctx.fillStyle = "red";
            ctx.textAlign = "center";
            ctx.fillText("Game Over...", canvas.width/2, canvas.height/2);
        }
        else if(_self.gameState == "win")
        {
            ctx.font = "80px Comic Sans MS";
            ctx.fillStyle = "red";
            ctx.textAlign = "center";
            ctx.fillText("You Win !", canvas.width/2, canvas.height/2);
        }
    }
}

window.onload = function(){
    var game = new Arena(context);
    game.init();
}