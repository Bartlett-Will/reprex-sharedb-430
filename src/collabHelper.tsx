import CollabEditor from "./CollabEditor";
import connection from "./connection";
import sharedb, { Query } from "sharedb/lib/client";

interface DocSpec {
  id: number;
  data: string;
}

export function getNewDoc(spec: DocSpec, results: any[] | undefined) {
  console.log("getNewDoc Called");
  if (results) {
    if (results.length === 0) {
      console.log("results is empty");
      let newDoc = connection.get("editors", "" + spec.id);
      newDoc.fetch(function (err) {
        if (err) throw err;
        if (newDoc.type === null) {
          newDoc.create([{ insert: spec.data }], "rich-text");
          return;
        }
      });
      return <CollabEditor doc={newDoc} />;
    } else if (results.every((doc: sharedb.Doc) => "" + spec.id !== doc.id)) {
      console.log("results don't match");
      const newDoc = connection.get("editors", "" + spec.id);
      newDoc.fetch(function (err) {
        if (err) throw err;
        if (newDoc.type === null) {
          newDoc.create([{ insert: spec.data }], "rich-text");
          return;
        }
      });
      return <CollabEditor doc={newDoc} />;
    } else {
      console.log("results match");
      const result = results.find((results) => results.id === "" + spec.id);
      const existingDoc = connection.get("editors", result.id);
      existingDoc.fetch(function (err) {
        if (err) throw err;
      });
      return <CollabEditor doc={existingDoc as sharedb.Doc} />;
    }
  }
}
