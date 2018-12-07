var Monster = function(posX, posY){
    console.log('Monster', posX, posY);

    this.x = posX;
    this.y = posY;
    
    this.HP = 100;
    this.MHP = 100;
    this.ATK = 53;
    this.DEF = 40;
    this.bAlive = true;

    this.bUnderAttack = false;

    this.direction = 0; //0: up, 1: down, 2: left, 3: right
    var _self = this;
    
    this.checkMovable = function(x,y){
        if(arena_data[y][x] == 0) return true;
        else{
            _self.direction = Math.floor(Math.random()*4);
            return false;
        }
    }

    this.checkNeighborIsPlayer = function(){
        if( arena_data[_self.y-1][_self.x] == 3 ||
            arena_data[_self.y+1][_self.x] == 3 ||
            arena_data[_self.y][_self.x-1] == 3 ||
            arena_data[_self.y][_self.x+1] == 3){
                
                //attack player 
                var evt = new CustomEvent('attack-player',{detail:{attack:_self.ATK}});
                window.dispatchEvent(evt);
                return true;
            }
        else return false;
    }
    
    this.getAttack = function(amount){
        console.log('monster is under attacking now', amount);
        var damage = 0;
        if(amount <= _self.DEF) damage = Math.floor(Math.random()*6)+1;
        else damage = amount - _self.DEF;

        _self.HP -= damage;
        if(_self.HP <= 0)
        {
            _self.HP = 0;
            _self.bAlive = false;
            arena_data[_self.y][_self.x] = 0;
        }
    }
    this.move = function(){
        if(_self.bAlive == false) return false;
        if(_self.checkNeighborIsPlayer() == true){
            //try to attack
            return false;
        }
        if(_self.bUnderAttack == false)
        {
            switch(_self.direction){
                case 0:
                    if(_self.checkMovable(_self.x, _self.y-1) == true){
                        arena_data[_self.y][_self.x] = 0;
                        arena_data[--_self.y][_self.x] = 4;
                    }
                    break;
                case 1:
                    if(_self.checkMovable(_self.x, _self.y+1) == true){
                        arena_data[_self.y][_self.x] = 0;
                        arena_data[++_self.y][_self.x] = 4;
                    }
                    break;
                case 2:
                    if(_self.checkMovable(_self.x-1, _self.y) == true){
                        arena_data[_self.y][_self.x] = 0;
                        arena_data[_self.y][--_self.x] = 4;
                    }
                    break;
                case 3:
                    if(_self.checkMovable(_self.x+1, _self.y) == true){
                        arena_data[_self.y][_self.x] = 0;
                        arena_data[_self.y][++_self.x] = 4;
                    }
                    break;
            }
        }
    }

    this.startMoving = function(){
        setInterval(_self.move,300);
    }

    _self.startMoving();
}