import React from 'react'; //reactをインポートする。
import ReactDOM from 'react-dom'; //reacのコードをHTMLで反映するときに使う。最後に読み込む。appのトップレベルのファイルに書く。
import './index.css';


//引数のpropsにBordのpropsが入る。
function Square(props) {
    return (                         //onClickはイベントリスナ
      <button className={`square ${props.isHighlight ? 'highlight' : ''}`}　onClick={()=>{props.onClick()}}>
        {props.value}
      </button>
    );
}

	class Board extends React.Component {
    // デフォルトをfalseにしてないと全部なっちゃう
      renderSquare(i, isHighlight = false) {
        return (
        	<Square
        		value={this.props.squares[i]}
        		onClick={()=> this.props.onClick(i)}
        		key={i}
            isHighlight = {isHighlight}
        	/>
        );
      }

      render() {
        return (
          <div>
            {
              Array(3).fill(0).map((row, i) => {
                return (
                  <div className="board-row" key={i}> {/*keyを追加*/}
                    {
                      Array(3).fill(0).map((col, j) => {
                        return(
                          this.renderSquare(i * 3 + j,this.props.highlightCells.indexOf(i * 3 + j) !== -1 )
                        )
                      })
                    }
                  </div>
                )
              })
            }
          </div>
        );
      }
    }

    class Game extends React.Component {
      constructor(props){
      	super(props);
      	this.state = {
      		history: [{
      			squares: Array(9).fill(null),
             //配列のSquare(９マス分の)値
      		}],
      		stepNumber: 0,//今何番目の着手かを表す。
      		xIsNext: true, //trueならx, falseなら○
      	};
      }


      handleClick(i) {
      	//原点はここ0, this.state.stepNumber + 1を書かないとjumpToメソッド後いらない履歴が保持されたまま反映される。
      	const history = this.state.history.slice(0, this.state.stepNumber + 1);
      	const current = history[history.length - 1];　//lengthは配列の長さを取ってくる。
      	// つまり ['a', 'b', 'c']があったとき長さは3　3 - 1をするとインデックス番号2がそれる。
	  	const squares = current.squares.slice(); //最新(直前)の配列をコピー

		if (calculateWinner(squares)|| squares[i]) {
			return; //処理を止める。
		}

		console.log(`変更前${JSON.stringify(squares)}`);
		squares[i] = this.state.xIsNext? 'X': 'O';  //クリックされた要素を指定
		console.log(`変更後${JSON.stringify(squares)}`);


		//あくまでstateに更新リクエストをするだけ
		this.setState({

			history: history.concat([{
      			squares: squares, //最新(直前)の配列を追加　*squares[i]で変更が加えられている。
      			col:(i % 3) + 1, //数字が3より小さいならiがそのままあまり値
      			row: Math.floor(i / 3 + 1) //引数として与えた数以下の最大の整数を返します
      		}]),
      		stepNumber: history.length,//奇数ならx、偶数ならO
			xIsNext: !this.state.xIsNext,
		});
		// console.log(JSON.stringify(history.concat([{squares: squares}]),));
	  }

	  jumpTo(step){
	  	this.setState({
	  		stepNumber: step, //historyのインデックス番号が入っている。
	  		xIsNext: (step%2) === 0, //奇数ならx、偶数ならO
	  	});
	  }


      render() {
      	// console.log(this.state.history.length);
      	const history = this.state.history;
  	    const current = history[this.state.stepNumber];//stepNumber によって現在選択されている着手をレンダーcurrent.squaresのため
  	    const winner = calculateWinner(current.squares);

  	    		//stepはvalue, moveはindex
  	    const moves = history.map((step, move)=>{
	    				//moveが0ならfalse
	    	const desc = move ?
    			'Move #' + move + '(' + step.col + ',' + step.row + ')': //変更
    			'Game start';
	    	return (
	    		<li key={move}>
	    			<button onClick={()=> this.jumpTo(move)} className={this.state.stepNumber === move? 'bold' : '' }>
	    				{desc}
	    			</button>
	    		</li>
	    	);
	    // console.log(JSON.stringify(moves));
	    });

      	let status;
        if (winner){
        	status = 'Winner: ' + winner.parson;
        } else {
        	status = 'Next player:' + (this.state.xIsNext? 'X': 'O');
        }

        return (
          <div className="game">
            <div className="game-board">
              <Board
              	squares={current.squares}
              	onClick={(i)=> {this.handleClick(i)}}// イベントリスナにはイベントの処理を渡す。
                highlightCells={winner? winner.line : []}
              />
            </div>
            <div className="game-info">
              <div>{status}</div>
              <ol>{moves}</ol>
            </div>
          </div>
        );
      }
    }



function calculateWinner(squares) {
	//勝ちパターン
	const line= [
		[0,1,2],
		[3,4,5],
		[6,7,8],
		[0,3,6],
		[1,4,7],
		[2,5,8],
		[0,4,8],
		[2,4,6],
	];


	for (let i=0; i < line.length; i++) {
		const [a,b,c] = line[i];

		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
			return {
        parson: squares[a],  //買った人物
        line:  [a,b,c]         //揃ったマス
      };
		}
	}
	return null; //ifの処理が9通り終わり、squares[a];が返されなかったらnullを返す。
				//仮にif文のreturnが実行されたら、calculateWinner(squares)の処理が終わる。
}

















//------------------------------------------------------------

// 最後にhtmlへ反映させる。
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


















