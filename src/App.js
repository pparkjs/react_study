import React, {
  useCallback,
  useMemo,
  useEffect,
  useRef,
  useReducer,
} from "react";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import LifeCycle from "./Lifecycle";
// import OptimizeTest from "./OptimizeTest";

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      return action.data; // 이게 새로운 state가 된다.
    }
    case "CREATE": {
      const created_date = new Date().getTime();
      const newItem = {
        ...action.data,
        created_date,
      };
      return [newItem, ...state];
    }
    case "REMOVE": {
      return state.filter((it) => it.id !== action.targetId);
    }
    case "EDIT": {
      return state.map((it) =>
        it.id === action.targetId ? { ...it, content: action.newContent } : it
      );
    }
    default:
      return state;
  }
};

export const DiaryStateContext = React.createContext();

export const DiaryDispatchContext = React.createContext();

function App() {
  // const [data, setData] = useState([]);

  const [data, dispatch] = useReducer(reducer, []);

  const dataId = useRef(0);

  const getData = async () => {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    ).then((res) => res.json());

    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        created_date: new Date().getTime(),
        id: dataId.current++,
      };
    });

    dispatch({ type: "INIT", data: initData });
    // setData(initData);
  };

  useEffect(() => {
    getData();
  }, []);

  const onCreate = useCallback((author, content, emotion) => {
    dispatch({
      type: "CREATE",
      data: {
        author,
        content,
        emotion,
        id: dataId.current,
      },
    });

    // const created_date = new Date().getTime();
    // const newItem = {
    //   author,
    //   content,
    //   emotion,
    //   created_date,
    //   id: dataId.current,
    // };
    dataId.current += 1;
    // useCallback의 딜레마에 벗어나기 위해 함수에 인자로 함수를 전달하는 함수형 업데이트 이용
    // newItem을 추가한 data를 return해주는 것을 전달한 것
    // 이렇게 사용하면 dependecy 인자에 data를 안넣고 비울 수 있음
    // -> 항상 최신의 state를 인자를 통해서 참고할 수 있음
    // setData((data) => [newItem, ...data]); //원래 데이터 를 가져오고 새로운 item은 최상단에 나오도록 함
  }, []);

  const onDelete = useCallback((targetId) => {
    dispatch({ type: "REMOVE", targetId });

    // filter 이용해서 삭제할 Id에 대한 일기 빼고 해당 객체 리스트 가져옴
    // const newDiaryList = data.filter((it) => it.id !== targetId);

    // 항상 인자부분에 data사용하고 return부분에 data를 사용해야 최신 data 사용가능
    // setData((data) => data.filter((it) => it.id !== targetId));
  }, []);

  const onEdit = useCallback((targetId, newContent) => {
    dispatch({ type: "EDIT", targetId, newContent });
    // setData((data) =>
    //   data.map((it) =>
    //     it.id === targetId ? { ...it, content: newContent } : it
    //   )
    // );
  }, []);

  // useMemo 활용하는 이유는 App 컴포넌트가 재생성될떄 해당 dispatches도 재생성되기 때문에
  // useMemo로 묶어서 최적화 풀리지않게 보내야함
  const memoizedDispatches = useMemo(() => {
    return { onCreate, onDelete, onEdit };
  }, []);

  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return { goodCount, badCount, goodRatio };
  }, [data.length]);

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDispatches}>
        <div className="App">
          {/* <LifeCycle /> */}
          {/* <OptimizeTest /> */}
          <DiaryEditor />
          <div>전체 일기 : {data.length}</div>
          <div>기분 좋은 일기 개수 : {goodCount}</div>
          <div>기분 나쁜 일기 개수 : {badCount}</div>
          <div>기분 좋은 일기 비율 : {goodRatio}</div>
          <DiaryList />
        </div>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
