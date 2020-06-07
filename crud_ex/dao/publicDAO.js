var pool = require('./mysqlConnect');

function connectionTest() {
    pool.getConnection(function (errPool,conn) {
        if(errPool){
            conn.log(errPool.message)
        }else{
            conn.query('SELECT NOW()',function (errconn, result){
                if(errconn){
                    console.log(errconn.message)
                }else{
                    console.log(JSON.stringify(result));
                }
            });
        }
        conn.release();
    });
}


function selectOne(sql, callback) {
	pool.getConnection( function(errpool, conn) {
		if(errpool) {
			console.log(errpool.message);
			callback("pool error", null);
			return;
		}

		conn.query(sql, function (errconn, result) {

			if(errconn) {
				console.log(errconn.message);
				callback("connection error", null);
				return;
			}
			resultCnt = result.length;
			if(resultCnt < 1) {
				callback("no result", null);
				return;
			}
			callback("success", result[0]);
		});

		conn.release();
	});
}

function selectALL(sql, callback) {
	pool.getConnection( function(errpool, conn) {
		if(errpool) {
			console.log(errpool.message);
			callback("pool error", null);
			return;
		}

		conn.query(sql, function (errconn, result) {

			if(errconn) {
				console.log(errconn.message);
				callback("connection error", null);
				return;
			}

			resultCnt = result.length;
			if(resultCnt < 1) {
				callback("no result", null);
				return;
			}

			callback("success", result);

		});

		conn.release();
	});
}

function change(sql,data, callback) {
	pool.getConnection( function(errpool, conn) {
		if(errpool) {
			console.log(errpool.message);
			callback("pool error", null);
			return;
		}

		conn.query(sql,data, function (errconn) {

			if(errconn) {
				console.log(errconn.message);
				callback("connection error", null);
				return;
			}

			//callback("success", result);

		});

		conn.release();
	});
}



module.exports = {
   // connectionTest:connectionTest,
   selectOne:selectOne,
   selectALL:selectALL,
   change:change
}