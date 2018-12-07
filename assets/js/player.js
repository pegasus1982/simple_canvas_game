var Player = function(posX, posY){
    console.log('player',posX, posY);

    this.x = posX;
    this.y = posY;
    
    this.HP = 300;
    this.MHP = 300;
    this.ATK = 50;
    this.DEF = 30;
    this.direction = "up";

    var _self = this;

    this.checkMovable = function(x,y){
        if(arena_data[y][x] == 0) return true;
        //check if posion
        if(arena_data[y][x] == 5 && _self.HP < _self.MHP){
            arena_data[y][x] = 0;
            this.HP = _self.MHP;
            return true;
        }
        else return false;
    }

    this.getAttack = function(amount){
        var damage = 0;
        if(amount <= _self.DEF) damage = Math.floor(Math.random()*6)+1;
        else damage = amount - _self.DEF;

        _self.HP -= damage;
        if(_self.HP <= 0)
        {
            console.log('game over');
            var evt = new CustomEvent('game-over');
            window.dispatchEvent(evt);
            _self.HP = 0;
        }
    }

    this.attack = function(){
        var evt = new CustomEvent('attack-monster',{detail:{attack:_self.ATK, direction:_self.direction}});
        window.dispatchEvent(evt);
    }

    document.onkeydown = function(event){
        var keyDownEvent = event || window.event,
        keycode = (keyDownEvent.which) ? keyDownEvent.which : keyDownEvent.keyCode;
        
        var LEFT = 37;
        var UP = 38;
        var RIGHT = 39;
        var DOWN = 40;
        var ATTACK = 65;

        switch(keycode)
        {
            case UP:
                if(_self.checkMovable(_self.x, _self.y-1) == true){
                    arena_data[_self.y][_self.x] = 0;
                    arena_data[--_self.y][_self.x] = 3;
                }
                _self.direction = "up";
                break;
            case DOWN:
                if(_self.checkMovable(_self.x, _self.y+1) == true){
                    arena_data[_self.y][_self.x] = 0;
                    arena_data[++_self.y][_self.x] = 3;
                }
                _self.direction = "down";
                break;
            case LEFT:
                if(_self.checkMovable(_self.x-1, _self.y) == true){
                    arena_data[_self.y][_self.x] = 0;
                    arena_data[_self.y][--_self.x] = 3;
                }
                _self.direction = "left";
                break;
            case RIGHT:
                if(_self.checkMovable(_self.x+1, _self.y) == true){
                    arena_data[_self.y][_self.x] = 0;
                    arena_data[_self.y][++_self.x] = 3;
                }
                _self.direction = "right";
                break;
            case ATTACK:
                _self.attack();
                break;
        }
    }
}