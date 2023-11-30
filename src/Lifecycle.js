import React,{useEffect,useState} from 'react';

const UnmountTest = () =>{
    useEffect(()=>{
        console.log("Mount!")

        return ()=>{
            // Unmount 시점에 실행되게 됨
            console.log("Unmount!");
        }
    },[])


    return <div>Unmount Testing Component</div>
}

const LifeCycle = ()=>{
    const [count,setCount] = useState(0);
    const [text,setText] = useState("");

    const [isVisible, setIsVisible] = useState(false);
    const toggle = () => setIsVisible(!isVisible);

    // component가 mount된 시점에만 작동함 (ex. 페이지 접속 및 새로고침?)
    // count 올려봐도 작동안됨 (mount 된 시점에 실행 시키고 싶을 때 써라)
    useEffect(()=>{
        console.log("Mount!")
    }, []);

    // dependencies 없이 하면 페이지 rerender 될때 도 실행된다.
    // component가 업데이트되는 시점에 함수 실행시키고 싶을 때 써라
    useEffect(()=>{
        console.log("Update!");
    });

    // 해당 지정한 dependecies가 변동이 있을 때만 실행된다.
    useEffect(()=>{
        console.log(`count is update : ${count}`)
        if(count > 5){
            alert("count가 5를 넘었습니다 따라서 1로 초기화됩니다.")
            setCount(1);
        }
    }, [count]);

    useEffect(()=>{
        console.log(`text is update : ${text}`)
    }, [text])


    return <div style={{ padding:20}}>
        <button onClick={toggle}>ON/OFF</button>
        {isVisible && <UnmountTest/>} {/*단락회로 평가 이용해서 UnmountTest 실행 여부정함*/}

        <div>
            {count}
            <button onClick={() => setCount(count + 1)}>+</button>
        </div>
        <div>
            <input value={text} onChange={(e) => setText(e.target.value)}/>
        </div>
    </div>;
}

export default LifeCycle;