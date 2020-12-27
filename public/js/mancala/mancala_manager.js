const { Console } = require("console");

class Pot{
    
    constructor(index, stone_count){
        this.index = index;
        this.stone_count = stone_count;
    }

    setNext(pot){
        this.next = pot;
    }

    setOpposite(pot){
        this.opposite = pot;
    }

    getNext(){
        return this.next;
    }

    getOpposite(){
        return this.opposite;
    }
}

class Mancala extends Pot{
    constructor(index, player_id){
        super(index, 0);
        this.isMancala = true;
        this.player_id = player_id;   
    }
}


class GameState {
    constructor(stone_count, player1_id, player2_id) {
      this.stone_count = stone_count;
      this.initPots(stone_count, player1_id, player2_id);
    }

    initPots(stone_count,  player1_id, player2_id){
        this.player_IsTop = [];
        this.player_IsTop[player1_id] = false;
        this.player_IsTop[player2_id] = true;

        let pot0 = new Pot(0, 6);
        let pot1 = new Pot(1, 6);
        let pot2 = new Pot(2, 6);
        let pot3 = new Pot(3, 6);
        let pot4 = new Pot(4, 6);
        let pot5 = new Pot(5, 6);
        let pot6 = new Pot(6, 6);
        let pot7 = new Pot(7, 6);
        let pot8 = new Pot(8, 6);
        let pot9 = new Pot(9, 6);
        let pot10 = new Pot(10, 6);
        let pot11 = new Pot(11, 6);

        let Mancala0 = new Mancala(6);
        let Mancala1 = new Mancala(6);

        this.Mancalas = [];
        this.Mancalas[player1_id] = Mancala0;
        this.Mancalas[player2_id] = Mancala1;

        pot0.setNext(pot1);
        pot0.setOpposite(pot11);
        pot1.setNext(pot2);
        pot1.setOpposite(pot10);
        pot2.setNext(pot3);
        pot2.setOpposite(pot9);
        pot3.setNext(pot4);
        pot3.setOpposite(pot8);
        pot4.setNext(pot5);
        pot4.setOpposite(pot7);
        pot5.setNext(Mancala0);
        pot5.setOpposite(pot6);
        Mancala0.setNext(pot6, player1_id);
        pot6.setNext(pot7);
        pot6.setOpposite(pot5);
        pot7.setNext(pot8);
        pot7.setOpposite(pot4);
        pot8.setNext(pot9);
        pot8.setOpposite(pot3);
        pot9.setNext(pot10);
        pot9.setOpposite(pot2);
        pot10.setNext(pot11);
        pot10.setOpposite(pot1);
        pot11.setNext(Mancala1);
        pot11.setOpposite(pot0);
        Mancala1.setNext(pot0,player2_id);

        this.pots = [pot0, pot1, pot2, pot3, pot4, pot5, Mancala0, pot6, pot7, pot8, pot9, pot10, pot11, Mancala1];

    }

    IncrementPots(player_id, pot_number, stone_count_in_pot, IsFinishedInMancala){
        var IsTopPlayer = this.player_IsTop[player_id];

        pot_number  = IsTopPlayer ? pot_number + 7 : pot_number + 1;

        var pot = this.pots[pot_number];

        while(stone_count_in_pot > 1){

            pot.stone_count++;
            stone_count_in_pot--;
            pot = pot.getNext();
            if(pot.isMancala && pot.player_id != player_id)
                pot.getNext();
           
        }

        pot = pot.getNext();
        pot.stone_count++;

        if(pot.stone_count == 1){
            var opposite = pot.getOpposite();
            stones = 1 + opposite.stone_count;
            opposite.stone_count = 0;
            this.Mancalas[player_id].stone_count += stones;

        }

        isFinishedInOwnMancala = pot.isMancala() ? true : false;

    }
   
    isGameOver(){
        var stones = 0;
        for (const pot in this.pots) {
            if(!pot.isMancala())
                stones+= pot.stone_count;
        }

        if(stones == 0)
            return true;
        else    
            return false;
    }

    HasPlayerStonesToPlay(player_id){
        var startIndex = 0;
        var endIndex = 6
        if(this.player_IsTop[player_id]){
            startIndex = 7;
            endIndex = 12
        }        
           
        var stones = 0;
        for (let index = startIndex; index < endIndex; index++) {
            stones += pots[index].stone_count;
        }   

        if(stones == 0)
            return true;
        else    
            return false;

    }

    MoveStones(player_id, pot_number, isFinishedInOwnMancala) {
        console.log("move stone");
        let board = this.pots;
        let stone_count_in_pot = board[pot_number].stone_count;
        
        var isFinishedInOwnMancala = false;
        this.IncrementPots(player_id, pot_number, stone_count_in_pot, isFinishedInOwnMancala);              
        
    }
  }

let game_state;

exports.initGame = initGame;
exports.GameState = GameState;