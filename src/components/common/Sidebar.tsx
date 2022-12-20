import {NavLink} from 'react-router-dom';
import styled from "styled-components";
import imgFile from '../../assets/logo192.png';
import React,{useEffect,useRef,useState } from 'react'; 
import {MENU_LIST,CONTSTURL} from "../../vo/menuVo";
import {AiOutlineMail,AiFillGithub,AiOutlineMenu , AiOutlinePushpin,AiFillPushpin,AiOutlineDrag} from "react-icons/ai";

const Side = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 15%;
  height : 90%;
`;
const Profile = styled.img.attrs({
  src : `${imgFile}`
})`
  width: 150px;
  height: 150px;
  border-radius: 100%;
  margin-bottom : 20px;
  margin-left: -40px;
  background-color: #282c34;
`;

const Menu = styled.div`
  margin-top: 30px; 
  width: 30%;
  height : 50%;
  display: flex;
  flex-direction: column;
  -ms-user-select: none; 
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
`;

const TopMenu = styled.div`
  left : 917px;
  cursor      : pointer;
  height      : 6%;
  width       : 28%;
  z-index     : 50;
  display: flex;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  :hover{
    cursor : grab;
  }
  :active{
    cursor: grabbing;
  }
`
const Comment = styled.div`
  margin-bottom : 20%;
  width: 305px;
  margin-left: -120%;
`

const SideBottom = styled.div`
  margin-left: -68%;
  margin-top: 60%;
  width     : 30vw
`

const Sidebar = (props:MENU_LIST) : JSX.Element =>{

  const [icon , setIcon] = useState(true);
  //const [screenx , setScreenx] = useState(0);
  console.log(icon);
  const menus : Array<CONTSTURL>  = props.menulist;

  let childRef : React.MutableRefObject<any> = useRef<any>(null);
  let parentRef : React.MutableRefObject<any> = useRef<any>(null);
  let menuRef : React.MutableRefObject<any> = useRef<any>(null);
  let TopMenuRef : React.MutableRefObject<any> = useRef<any>(null);

  let moveBoolean : Boolean = false;
  useEffect(()=>{
    document.addEventListener('mouseup',mouseUp);
    window.addEventListener('resize',ResizeEnvet);
  });

/**
 * @param sidePx (사이드바 위치)
 * @param menuPx (menu위치)
 */
  const SidePxMenuPxSet = (sidePx : number , menuPx:number = 83.5) : void =>{
    childRef.current.style.transform = "translateX("+sidePx+"px)";
    menuRef.current.style.left = menuPx+'%';
    if(menuPx === 45){ // top 메뉴 아이콘 클릭시 left 설정
      moveCheck = "left";
    }
  }
 

  let defaulSize : number = (2133 - window.innerWidth)+ -1770;
  /**  
  * 브라우져 사이즈 변경시 사이드바 크기 조절 (전체화면 시 크기- 사이즈변경 시 크기 + 전체화면 기준 사이드바 위치)
  */
  const ResizeEnvet = () =>{
    let numPx : number = SidebarLocation();
    defaulSize = (2133 - window.innerWidth)+ -1770;
    if(numPx !== 0){
      SidePxMenuPxSet(defaulSize);
    }
  }

  let moveCheck : string = "right"; // 사이드바 오른쪽 왼쪽 움직일 기준 변수
  /**  
  * 현재 사이드바 위치 추적 하는 함수
  */
  const SidebarLocation = () : number =>{
    let strPx : string = childRef.current.style.transform;
    let split : string[] = strPx.split("(");
    let numPx : number = Number(split[1].replace(/px\)/,""));

    return numPx;
  }
  
  /**  
  * 사이드바 마우스 드래그 후 현재 위치에 맞게 사이드바 조절
  */
  const mouseUp = () : void =>{
    moveBoolean = false;
    let numPx : number = SidebarLocation();
    childRef.current.style.transition = "transform 500ms";
    menuRef.current.style.transition = "left 500ms";
    parentRef.current.style.backgroundColor = "rgb(255,255,255)"; // 뒷배경 원상복귀
    if(moveCheck === "right"){
      if(numPx > defaulSize/1.2){
        // 반 이상 넘어 오면 전부 펼치기
        SidePxMenuPxSet(0,45);
        moveCheck = "left";
      }else{
        // 반 미만 으로 오면 원래 상태로 복귀
        SidePxMenuPxSet(defaulSize,83.5);
        moveCheck = "right";
      }
    }else{ // 전부 펼쳐 졌을때 의 기준
      if(numPx > defaulSize/5){
        // 원래 상태로 복귀
        SidePxMenuPxSet(0,45);
        moveCheck = "left";
      }else{
        // 반 미만 으로 오면 전부 펼치기
        SidePxMenuPxSet(defaulSize,83.5);
        moveCheck = "right";
      }
    }

    //move 이벤트 삭제
    document.removeEventListener('mousemove',moveListener);
  }

  let screenx : number = 0; // 사이드바 클릭시 현재 마우스 위치 넣기 변수
  let defaultWidth : number = 0; // 사이드바 펼칠때 기준이 되는 변수
  /**  
  * 마우스 Down 시 이벤트 연결 및 스타일 변경 함수
  */
  const mouseDown = (e:React.MouseEvent) :void =>{
    screenx = e.screenX;
    moveBoolean = true;
    childRef.current.style.transition = "transform 0ms";
    menuRef.current.style.transition = "left 0ms";
    parentRef.current.style.backgroundColor = "rgb(170,170,170)"; // 사이드바 를 클릭하면 뒷배경 변경

    SidebarLocation(); // 현재 사이드바 위치 설정
    //사이드 바에서 마우스 down 시 이벤트 연결
    document.addEventListener('mousemove',moveListener);
  }
  /**  
  * 마우스 Down 후 이동시 사이드바 펼치기 혹은 접기 함수 (moveListener)
  */
   const moveListener = (e:any) :void =>{
    if(moveBoolean){
      let menupx = 0;
      if(moveCheck === "right"){
        defaultWidth = defaulSize;
        menupx = 83.5;
      }else{
        defaultWidth = 0;
        menupx = 45;
      }
      defaultWidth += e.screenX-screenx; // 오른쪽 기준일시 defaulSize += (현재 마우스 위치 - 클릭 했을때 시점의 마우스 위치);

      if(defaultWidth >= -1) { // 전부 펼쳐졌으면 더이상 움직이지 않음
        return;
      }
      SidePxMenuPxSet(defaultWidth,menupx);
    }else{
      return;
    }
  }

  /**  
  * menu 클릭시 사이드바 메뉴바 원상복귀
  */
  const menuClick = ():void =>{ // menu 클릭 시 사이드바 접기
    SidePxMenuPxSet(defaulSize,83.5);
  }


  let isPress = false;
  let prevPosX = 0;
  let prevPosY = 0;
  const startDrag = (e:any) :void =>{
    prevPosX = e.clientX;
    prevPosY = e.clientY;
    if(icon) isPress = true;
    
  }
  const endDrag = (e:any) : void =>{
    isPress = false;
  }

  const move = (e:any) : void =>{
    if (!isPress) return;
    const posX = prevPosX - e.clientX; 
    const posY = prevPosY - e.clientY; 
    console.log(posX);
    prevPosX = e.clientX; 
    prevPosY = e.clientY;
    console.log(TopMenuRef.current.offsetLeft);
    TopMenuRef.current.style.left = (TopMenuRef.current.offsetLeft - posX) + "px";
    TopMenuRef.current.style.top = (TopMenuRef.current.offsetTop - posY) + "px";
  }
  window.onmousemove = move;
  return (
  <div style={{width:"202%", height:"100%",display: "flex",transition:"all 4s ease"}} ref={parentRef}>
  
  <TopMenu ref={TopMenuRef} onMouseDown={(e)=>startDrag(e)} onMouseUp={(e)=>endDrag(e)} style={{position:"fixed"}}>
    <AiOutlineMenu className='menuIcon' onClick={()=>SidePxMenuPxSet(0,45)}/>
  {
        menus.map((menu,index)=>{
          return(
            <NavLink exact className='TopMenu' 
                          to={menu.path} 
                          key={index} 
                          
            >
              {menu.name}
            </NavLink>
          );
        })
      }
      {
        !icon ? <AiFillPushpin className='pinIcon' onClick={()=>setIcon(true)}/> : <AiOutlinePushpin className='pinIcon' onClick={()=>setIcon(false)}/>
      }   
  </TopMenu>
  <div className='sidebar Notdrag' style={{transform:"translateX("+defaulSize+"px)"}} onMouseDown={(e)=> mouseDown(e)} ref={childRef}>
  <Side className='SideSlide Notdrag' ref={menuRef}>
    <Menu>
    <Profile/>
    <Comment>
      {/* <p style={{color:"rgba(255,255,255,0.75)",fontSize:"22px"}}>Front End 개발자를 꿈꾸는 직장인 입니다.</p> */}
    </Comment>
      {
        menus.map((menu,index)=>{
          return(
            <NavLink exact onClick={()=>menuClick()} 
                          className='Notdrag SideMenu' 
                          to={menu.path} 
                          key={index} 
                          
            >
              {menu.name}
            </NavLink>
          );
        }) 
      }
      <SideBottom>
        <ul>
          <li><a href="https://github.com/MinGyeongHyeon/mgh" target="_blank" className='bottomMenu'><AiFillGithub size="29" color='rgb(255,255,255)'/></a></li>
          <li><a href="mailto:rudgus1004@gmail.com" className='bottomMenu'><AiOutlineMail size="29" color='rgb(255,255,255)'/></a></li>
        </ul>
        
      </SideBottom>
    </Menu>
  </Side>
  </div>

  </div>
  )
  
}

export default Sidebar;
