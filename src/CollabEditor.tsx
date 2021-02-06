import React from "react";
import ReactQuill, { Quill } from "react-quill";

import "react-quill/dist/quill.snow.css";
import sharedb from "sharedb/lib/client";

interface Props {
  doc: sharedb.Doc;
}

const CollabEditor: React.FC<Props> = ({ doc }) => {
  const [delta, setDelta] = React.useState();

  const handleChange = (delta: any, oldDelta: any, source: string) => {
    if (source !== "user") {
      return;
    }
    console.log(delta);
    doc.submitOp(delta, { source: true }, function (err) {
      if (err) {
        console.error(err);
        console.log("Op not submitted");
        return;
      }
    });
  };

  React.useEffect(() => {
    doc.subscribe((error: sharedb.Error) => {
      if (error) {
        console.log("Error:", error);
      }
      setDelta(doc.data);
      doc.on("op", function (op: any, source: Boolean) {
        if (source === true) {
          return;
        }
        setDelta(op);
      });
    });

    return () => {
      doc.unsubscribe();
    };
  }, []);

  return (
    <div>
      <ReactQuill value={delta} onChange={handleChange} />
    </div>
  );
};
export default CollabEditor;
