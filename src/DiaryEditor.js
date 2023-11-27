import React, { useContext, useEffect, useRef, useState } from "react";
import { DiaryDispatchContext } from "./App";

const DiaryEditor = () => {
  // 객체로 가져오기 때문에 비구조 할당으로 가져와야함
  const { onCreate } = useContext(DiaryDispatchContext);

  const authorInput = useRef();
  const contentInput = useRef();
  const [state, setState] = useState({
    author: "",
    content: "",
    emotion: 1,
  });

  const handleChangeState = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (state.author.length < 1) {
      // focus
      authorInput.current.focus();
      return;
    }

    if (state.content.length < 5) {
      // focus
      contentInput.current.focus();
      return;
    }
    onCreate(state.author, state.content, state.emotion);
    setState({
      author: "",
      content: "",
      emotion: 1,
    });
    alert("저장 성공");
  };

  return (
    <div className="DiaryEditor">
      <h2>오늘의 일기</h2>
      <div>
        {/* 아래처럼 value에 저렇게 값을 넣으면 직접 키보드로 값 변경 x */}
        <input
          ref={authorInput}
          value={state.author}
          name="author"
          onChange={handleChangeState}
        />
      </div>
      <div>
        <textarea
          ref={contentInput}
          value={state.content}
          name="content"
          onChange={handleChangeState}
        />
      </div>
      <div>
        <select
          name="emotion"
          value={state.emotion}
          onChange={handleChangeState}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </div>
      <div>
        <button onClick={handleSubmit}>일기 저장하기</button>
      </div>
    </div>
  );
};
export default React.memo(DiaryEditor);
