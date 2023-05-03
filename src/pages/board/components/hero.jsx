    import React from "react";
    import { useState } from "react";
    import { useR } from "react";
    import "../styles/hero.css"

    function Board(){
      let columns = [];
      let currentPlayerIndex = 0;
      let isWon = false;
      let isDisabled = true;
      let isTie = false;
      const indexes = [1,2,3,4,5,6,7,8,9]
      
      const[players, setPlayers] = useState([{
          name: "Player 1",
          symbol: "X"
      }, 
      {
          name: "Computer",
          symbol: "O"
      }]);

        function getCurrentPlayerSymbol(){
            return players[currentPlayerIndex].symbol;
        }

        function getCurrentPlayerName(){
            return players[currentPlayerIndex].name;
        }
        
        function setPlayerPosition(event){
          if (!isDisabled){
            isDisabled = true;
            columns = document.querySelectorAll(".column");
            let column = event.target;
            takePosition(column);
            if(!isWon && !isTie) allowComputerToPlay();
          }
        }

        function takePosition(column){
          if(column.innerHTML == ""){
            let symbol = getCurrentPlayerSymbol();
            column.style.color = symbol == "O" ? "black" : "blue";
            column.innerHTML = symbol;     
            checkWinning(symbol);
            checkTie();
            if(!isWon && !isTie) processNextTurn();
          }
        }

        function processNextTurn(){
          currentPlayerIndex = currentPlayerIndex == 1?0:1;
          printPlayerName();
        }

        function printPlayerName(){
          let playerName = getCurrentPlayerName();
          document.querySelector(".playerName").style.marginBottom = playerName == "Player 1" ? "25%" : "10%";
          if(currentPlayerIndex == 0){
            document.querySelector(".playerName").innerHTML = playerName;
            document.querySelector(".playerName").append(", it's your turn to play.");
          }
          else {
            document.querySelector(".playerName").innerHTML = "Computer is about playing";
            let time = 1000;
            for (let index = 0; index < 5; index++) {
              setTimeout(()=>document.querySelector(".playerName").append("."), time);
              time+=500;
            }
          }
        }

        function allowComputerToPlay(){
          isDisabled = true;
          let random = Math.floor(Math.random() * 8 )+1;
          if(columns[random].innerHTML != "") allowComputerToPlay();
          setTimeout(()=>{
            takePosition(columns[random]);
            isDisabled = false;
          }, 4000);
        }
          
        function checkTie(){
            let count = 0;
            for (let index = 0; index < columns.length; index++) {
                for (let index2 = 0; index2 < columns[index].length; index2++) {
                    if(columns[index][index2].innerHTML != "") count++;
                }
            }
            if(count == 9){
              isWon = true;
              isTie = true;
              isDisabled = true;
              die();
            }
        }
        
          
        function checkWinning(symbol){
            traceRows(symbol);
            traceColumns(symbol);
            traceSlants(symbol);
        }

        function traceRows(symbol) {
            validateWinningPosition(symbol, columns[0], columns[1], columns[2]);
            validateWinningPosition(symbol, columns[3], columns[4], columns[5]);
            validateWinningPosition(symbol, columns[6], columns[7], columns[8]);
        }
        
        function traceColumns(symbol) {
          validateWinningPosition(symbol, columns[0], columns[3], columns[6])
          validateWinningPosition(symbol, columns[1], columns[4], columns[7])
          validateWinningPosition(symbol, columns[2], columns[5], columns[8])
          }
        
        function traceSlants(symbol) {
          validateWinningPosition(symbol, columns[0], columns[4], columns[8]);
          validateWinningPosition(symbol, columns[2], columns[4], columns[6]);
        }
        
        function validateWinningPosition(symbol, column1, column2, column3) {
          if (
            column1.innerHTML == symbol &&
            column2.innerHTML == symbol &&
            column3.innerHTML == symbol
          )
          {
            isWon = true;
            isDisabled = true;
            paintWinningColumns(column1, column2, column3);
            setTimeout(()=>{ 
              document.querySelector(".playerName").innerHTML = "";
              let name = getCurrentPlayerName();
              if (name == "Player 1"){
                document.querySelector(".rightText").innerHTML = "Congratulations "+getCurrentPlayerName();
                document.querySelector(".rightText").append(", you won!");
              }
              else document.querySelector(".rightText").innerHTML = "Awwwn..."+ name +" won";
            }, 3500)
          }
        }

        function enableAllColumns(){
          columns = document.querySelectorAll(".column");
          let random = Math.round(Math.random())
          isDisabled = false;
          if (random == 1) document.querySelector(".playerName").innerHTML = getCurrentPlayerName() + ", It's your turn to play"
          else {
            processNextTurn()
            allowComputerToPlay()
          }
        }

        function reload(){window.location.reload()}
        
        function paintWinningColumns(column1, column2, column3) {
          setTimeout(() => {
            column1.style.backgroundColor = "green";
            column1.style.color = "white";
          }, 500);
          setTimeout(() => {
            column2.style.backgroundColor = "green";
            column2.style.color = "white";
          }, 1100);
          setTimeout(() => {
            column3.style.backgroundColor = "green";
            column3.style.color = "white";
          }, 1700);
          discardReduncdantColumns(column1, column2, column3);
        }
        
        function discardReduncdantColumns(column1, column2, column3) {
          let time = 2300;
          document.querySelector(".board").style.border = "none";
          for (let index = 0; index < columns.length; index++) {
            let column = columns[index];
            if (column != column1 && column != column2 && column != column3) {
              setTimeout(() => {
                column.style.border = "none";
                column.style.backgroundColor = "black";
                column.style.color = "black";
                document.querySelector(".board").style.backgroundColor = "black";
              }, time);
              time += 100;
            }
          }
        }

        
        function die(){
            let time = 500;
            for (let index = 0; index < columns.length; index++) {
                for (let index2 = 0; index2 < columns[index].length; index2++) {
                    setTimeout(()=>{
                        columns[index][index2].style.border = "none";
                        columns[index][index2].style.backgroundColor = "black";
                        columns[index][index2].style.color = "white";
                        document.querySelector(".board").style.border = "none";
                    }, time)
                    time += 300;
                }
            }
            document.querySelector(".playerName").innerHTML = "";
            document.querySelector(".rightText").innerHTML = "Ooops.... It's a tie!"
            setTimeout(()=> {
                document.querySelector(".mainContainer").remove();
            }, 3500)
        }
        

        return(
            <React.Fragment>
            <div className="mainContainer">
                <h1 className="playerName">Please click start game to begin</h1>
                <div className="board">
                    <div className="column" id="c1" onClick={setPlayerPosition}></div>
                    <div className="column" id="c2" onClick={setPlayerPosition}></div>
                    <div className="column" id="c3" onClick={setPlayerPosition}></div>
                    <div className="column" id="c4" onClick={setPlayerPosition}></div>
                    <div className="column" id="c5" onClick={setPlayerPosition}></div>
                    <div className="column" id="c6" onClick={setPlayerPosition}></div>
                    <div className="column" id="c7" onClick={setPlayerPosition}></div>
                    <div className="column" id="c8" onClick={setPlayerPosition}></div>
                    <div className="column" id="c9" onClick={setPlayerPosition}></div>
                </div>
                <h1 className="rightText">Click any of the empty boxes</h1>
            <div className="buttons">
            <button onClick={enableAllColumns}>Start game</button> <button onClick={reload}>Restart game</button>
            </div>         
            </div>
            </React.Fragment>
        )
        }
    export default Board;