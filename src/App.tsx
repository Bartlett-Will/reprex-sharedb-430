import React, { useState, useEffect } from "react";
import sharedb from "sharedb/lib/client";
import { getNewDoc } from "./collabHelper";
import connection from "./connection";

const spec1 = {
  id: 0,
  data: "test1",
};

const App = () => {
  const [results, setResults] = useState<any[]>();
  console.log("App State is Set To Empty");

  useEffect(() => {
    console.log("App did mount");
    var query = connection.createSubscribeQuery(
      "editors",
      {},
      {},
      (err: sharedb.Error, results: sharedb.Doc[]) => {
        if (err) {
          console.log(err);
          console.log("THE QUERY DID NOT WORK");
        }
        setResults(results);
      }
    );
    query.on("changed", update);
    function update() {
      setResults(query.results);
    }

    return () => {
      query.destroy();
      connection.close();
    };
  }, []);

  //query.on functions need to be added
  return <div className="App">{getNewDoc(spec1, results)}</div>;
};

export default App;
