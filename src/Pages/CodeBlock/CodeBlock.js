import React from "react";
import CodeRunner from "../../component/CodeRunner/CodeEditor";
import "./CodeBlock.css";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init();

const CodeBlock = () => {
  return (
    <div
      className="container row comment-editor"
      data-aos="fade-right"
      data-aos-offset="300"
      data-aos-easing="ease-in-sine"
      style={{ position: "relative" }}
    >
      <div className="main-frame">
        <span className="comment-line"> </span>

        <div className="main-box">
          <div className="window-container wea">
            <p>
              <span id="usuario-name">Añadir Comentario</span>
            </p>
          </div>
                  <CodeRunner />
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
