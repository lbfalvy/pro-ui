(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{215:function(module,exports){},347:function(module,exports,__webpack_require__){__webpack_require__(348),__webpack_require__(505),__webpack_require__(506),__webpack_require__(721),module.exports=__webpack_require__(726)},416:function(module,exports){},506:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__(265)},721:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__(34),__webpack_require__(94),__webpack_require__(61),__webpack_require__(722),__webpack_require__(49),__webpack_require__(50),__webpack_require__(723),__webpack_require__(724),__webpack_require__(725);var _home_runner_work_pro_ui_pro_ui_node_modules_storybook_client_api__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__(112),_home_runner_work_pro_ui_pro_ui_node_modules_storybook_client_logger__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__(4),_home_runner_work_pro_ui_pro_ui_storybook_preview_js__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__(215);function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}Object.keys(_home_runner_work_pro_ui_pro_ui_storybook_preview_js__WEBPACK_IMPORTED_MODULE_11__).forEach((function(key){var value=_home_runner_work_pro_ui_pro_ui_storybook_preview_js__WEBPACK_IMPORTED_MODULE_11__[key];switch(key){case"args":case"argTypes":return _home_runner_work_pro_ui_pro_ui_node_modules_storybook_client_logger__WEBPACK_IMPORTED_MODULE_10__.a.warn("Invalid args/argTypes in config, ignoring.",JSON.stringify(value));case"decorators":return value.forEach((function(decorator){return Object(_home_runner_work_pro_ui_pro_ui_node_modules_storybook_client_api__WEBPACK_IMPORTED_MODULE_9__.b)(decorator,!1)}));case"loaders":return value.forEach((function(loader){return Object(_home_runner_work_pro_ui_pro_ui_node_modules_storybook_client_api__WEBPACK_IMPORTED_MODULE_9__.c)(loader,!1)}));case"parameters":return Object(_home_runner_work_pro_ui_pro_ui_node_modules_storybook_client_api__WEBPACK_IMPORTED_MODULE_9__.d)(function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}({},value),!1);case"argTypesEnhancers":return value.forEach((function(enhancer){return Object(_home_runner_work_pro_ui_pro_ui_node_modules_storybook_client_api__WEBPACK_IMPORTED_MODULE_9__.a)(enhancer)}));case"globals":case"globalTypes":var v={};return v[key]=value,Object(_home_runner_work_pro_ui_pro_ui_node_modules_storybook_client_api__WEBPACK_IMPORTED_MODULE_9__.d)(v,!1);default:return console.log(key+" was not supported :( !")}}))},726:function(module,exports,__webpack_require__){"use strict";(function(module){(0,__webpack_require__(265).configure)([__webpack_require__(727)],module,!1)}).call(this,__webpack_require__(202)(module))},727:function(module,exports,__webpack_require__){var map={"./Tabs/Tabs.stories.tsx":734};function webpackContext(req){var id=webpackContextResolve(req);return __webpack_require__(id)}function webpackContextResolve(req){if(!__webpack_require__.o(map,req)){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}return map[req]}webpackContext.keys=function webpackContextKeys(){return Object.keys(map)},webpackContext.resolve=webpackContextResolve,module.exports=webpackContext,webpackContext.id=727},729:function(module,exports,__webpack_require__){var api=__webpack_require__(730),content=__webpack_require__(731);"string"==typeof(content=content.__esModule?content.default:content)&&(content=[[module.i,content,""]]);var options={insert:"head",singleton:!1};api(content,options);module.exports=content.locals||{}},731:function(module,exports,__webpack_require__){(exports=__webpack_require__(732)(!1)).push([module.i,'.tabs-container{font-family:"Avenir Next",Helvetica,Arial,sans-serif;display:flex;flex-direction:column;background:#e2e2e2;color:#005f20}.tabs-container .tabs-container-heads{background:#c2c2c2;flex:0 0 1}.tabs-container .tabs-container-heads>div.height-holder{display:inline-block;width:0;overflow-x:hidden;white-space:nowrap;vertical-align:top;padding:7px 0 3px}.tabs-container .tabs-container-heads>div.tabs-container-head{cursor:pointer;user-select:none;display:inline-block;background:#d2d2d2;border-left:1px solid #c2c2c2;border-right:1px solid #c2c2c2;border-top:2px solid #d2d2d2;padding:7px 10px 3px}.tabs-container .tabs-container-heads>div.tabs-container-head.active{background:#e2e2e2;border-top:2px solid #55f}.tabs-container .tabs-container-heads>div.tabs-container-head.over:not(.dragged){border-top:2px solid #f2f2f2;background:#f2f2f2}.tabs-container .tabs-container-heads>div.tabs-container-head.over:not(.dragged).active{border-top:2px solid #f6f6f6;background:#f6f6f6}.tabs-container .tabs-container-heads.over{background:#d4d4d4}.tabs-container .tabs-container-bodies>div{display:none;padding:10px}.tabs-container .tabs-container-bodies>div.active{display:block}\n',""]),module.exports=exports},734:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"BasicUsage",(function(){return Tabs_stories_BasicUsage})),__webpack_require__.d(__webpack_exports__,"MultipleContainers",(function(){return Tabs_stories_MultipleContainers}));__webpack_require__(327),__webpack_require__(728),__webpack_require__(42);var objectSpread2=__webpack_require__(111),toConsumableArray=__webpack_require__(148),slicedToArray=__webpack_require__(36),react=__webpack_require__(1),react_default=__webpack_require__.n(react),DndProvider=__webpack_require__(739),esm=__webpack_require__(219),useDrop=(__webpack_require__(328),__webpack_require__(729),__webpack_require__(740)),useDrag=__webpack_require__(741),createForOfIteratorHelper=(__webpack_require__(127),__webpack_require__(61),__webpack_require__(79),__webpack_require__(338));function classList(classes){return Object.entries(classes).filter((function(entry){return entry[1]})).map((function(entry){return entry[0]})).join(" ")}function mergeRefs(){for(var _len=arguments.length,refs=new Array(_len),_key=0;_key<_len;_key++)refs[_key]=arguments[_key];var filteredRefs=refs.filter(Boolean);return filteredRefs.length?0===filteredRefs.length?filteredRefs[0]:function(inst){var _step,_iterator=Object(createForOfIteratorHelper.a)(filteredRefs);try{for(_iterator.s();!(_step=_iterator.n()).done;){var ref=_step.value;if("function"==typeof ref)ref(inst);else if(ref){ref.current=inst}}}catch(err){_iterator.e(err)}finally{_iterator.f()}}:null}try{classList.displayName="classList",classList.__docgenInfo={description:"",displayName:"classList",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/utils.tsx#classList"]={docgenInfo:classList.__docgenInfo,name:"classList",path:"src/utils.tsx#classList"})}catch(__react_docgen_typescript_loader_error){}try{mergeRefs.displayName="mergeRefs",mergeRefs.__docgenInfo={description:"",displayName:"mergeRefs",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/utils.tsx#mergeRefs"]={docgenInfo:mergeRefs.__docgenInfo,name:"mergeRefs",path:"src/utils.tsx#mergeRefs"})}catch(__react_docgen_typescript_loader_error){}var Tabs_Tabs_Tabs=function Tabs(_ref){var children=_ref.children,onMove=_ref.onMove,activeDefault=_ref.active,_React$useState=react_default.a.useState(activeDefault),_React$useState2=Object(slicedToArray.a)(_React$useState,2),active=_React$useState2[0],setActive=_React$useState2[1];!children.some((function(_ref2){return _ref2.id==active}))&&children.length&&setActive(children[0].id);var _useDrop=Object(useDrop.a)({accept:"TAB",drop:function drop(_ref3,monitor){var id=_ref3.id,metadata=_ref3.metadata;monitor.didDrop()||null==onMove||onMove(children.length,id,metadata)},collect:function collect(monitor){return monitor.isOver({shallow:!0})}},[children.length,onMove]),_useDrop2=Object(slicedToArray.a)(_useDrop,2),over=_useDrop2[0],drop=_useDrop2[1];return react_default.a.createElement("div",{"data-testid":"Tabs",className:"tabs-container"},react_default.a.createElement("div",{ref:drop,className:classList({"tabs-container-heads":!0,over:over})},react_default.a.createElement("div",{key:"height-holder",className:"height-holder"},"If you see this text, CSS is broken."),children.map((function(_ref4,idx){var id=_ref4.id,title=_ref4.title,metadata=_ref4.metadata;return react_default.a.createElement(react_default.a.Fragment,null,react_default.a.createElement(Tabs_Tab,{key:id,id:id,metadata:metadata,active:id==active,onDrop:function onDrop(id,meta){return null==onMove?void 0:onMove(idx,id,meta)},onClick:function onClick(){return setActive(id)}},title))}))),react_default.a.createElement("div",{className:"tabs-container-bodies"},children.map((function(_ref5){var id=_ref5.id,children=_ref5.children;return react_default.a.createElement(react_default.a.Fragment,null,react_default.a.createElement("div",{key:id,className:id==active?"active":""},children))}))))},Tabs_Tab=function Tab(_ref6){var id=_ref6.id,metadata=_ref6.metadata,children=_ref6.children,active=_ref6.active,onDrop=_ref6.onDrop,onClick=_ref6.onClick,_useDrop3=Object(useDrop.a)({accept:"TAB",drop:function drop(_ref7,monitor){var id=_ref7.id,metadata=_ref7.metadata;monitor.didDrop()||onDrop(id,metadata)},collect:function collect(monitor){return monitor.isOver({shallow:!0})}},[onDrop]),_useDrop4=Object(slicedToArray.a)(_useDrop3,2),over=_useDrop4[0],drop=_useDrop4[1],_useDrag=Object(useDrag.a)({type:"TAB",item:{id:id,metadata:metadata},collect:function collect(monitor){return monitor.isDragging()}},[id]),_useDrag2=Object(slicedToArray.a)(_useDrag,2),dragged=_useDrag2[0],drag=_useDrag2[1];return react_default.a.createElement("div",{ref:mergeRefs(drag,drop),className:classList({"tabs-container-head":!0,over:over,active:active,dragged:dragged}),onClick:onClick},children)},src_Tabs_Tabs=Tabs_Tabs_Tabs;try{Tabs_Tabs_Tabs.displayName="Tabs",Tabs_Tabs_Tabs.__docgenInfo={description:"",displayName:"Tabs",props:{onMove:{defaultValue:null,description:"",name:"onMove",required:!1,type:{name:"(toPosition: number, id: ID, metadata: any) => void"}},active:{defaultValue:null,description:"",name:"active",required:!1,type:{name:"ID"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/Tabs/Tabs.tsx#Tabs"]={docgenInfo:Tabs_Tabs_Tabs.__docgenInfo,name:"Tabs",path:"src/Tabs/Tabs.tsx#Tabs"})}catch(__react_docgen_typescript_loader_error){}__webpack_exports__.default={title:"Tabs",comopnent:src_Tabs_Tabs};var Tabs_stories_BasicUsage=function BasicUsage(){var _React$useReducer=react_default.a.useReducer((function(current,_ref){var _ref2=Object(slicedToArray.a)(_ref,2),id=_ref2[0],index=_ref2[1],items=Object(toConsumableArray.a)(current),currentIdx=items.findIndex((function(el){return el.id==id})),_items$splice=items.splice(currentIdx,1),elem=Object(slicedToArray.a)(_items$splice,1)[0];return items.splice(index,0,elem),items}),[{id:"foo",title:"0th tab",children:react_default.a.createElement("div",null,"My random content")},{id:"bar",title:"1st tab",children:react_default.a.createElement("div",null,"Wamble doffer goo")},{id:"baz",title:"Last tab",children:react_default.a.createElement("div",null,"It doesn't matter what goes here")}]),_React$useReducer2=Object(slicedToArray.a)(_React$useReducer,2),children=_React$useReducer2[0],move=_React$useReducer2[1];return react_default.a.createElement(DndProvider.a,{backend:esm.a},react_default.a.createElement(src_Tabs_Tabs,{onMove:function onMove(to,id){return move([id,to])}},children))},Tabs_stories_MultipleContainers=function MultipleContainers(){var _React$useReducer3=react_default.a.useReducer((function(current,_ref3){var id=_ref3.id,container=_ref3.container,index=_ref3.index,set=_ref3.meta,sets=Object(toConsumableArray.a)(current.map((function(set){return Object(toConsumableArray.a)(set)}))),currentIndex=sets[set].findIndex((function(el){return el.id==id})),_sets$set$splice=sets[set].splice(currentIndex,1),item=Object(slicedToArray.a)(_sets$set$splice,1)[0];return item=Object(objectSpread2.a)(Object(objectSpread2.a)({},item),{},{metadata:container}),sets[container].splice(index,0,item),sets}),[[{id:0,title:"tab #0",children:react_default.a.createElement("div",null,"First content")},{id:1,title:"tab #1",children:react_default.a.createElement("div",null,"I really wonder")},{id:2,title:"tab #2",children:react_default.a.createElement("div",null,"What could go in these")}],[{id:3,title:"tab #3",children:react_default.a.createElement("div",null,"Maybe movie references")},{id:4,title:"tab #4",children:react_default.a.createElement("div",null,"Or some witty remarks regarding the library")},{id:5,title:"tab #5",children:react_default.a.createElement("div",null,"I guess this will suffice for now")}]],(function(data){return data.map((function(set,idx){return set.map((function(el){return Object(objectSpread2.a)(Object(objectSpread2.a)({},el),{},{metadata:idx})}))}))})),_React$useReducer4=Object(slicedToArray.a)(_React$useReducer3,2),items=_React$useReducer4[0],move=_React$useReducer4[1];return react_default.a.createElement(DndProvider.a,{backend:esm.a},react_default.a.createElement(src_Tabs_Tabs,{onMove:function onMove(index,id,meta){return move({index:index,id:id,meta:meta,container:0})}},items[0]),react_default.a.createElement(src_Tabs_Tabs,{onMove:function onMove(index,id,meta){return move({index:index,id:id,meta:meta,container:1})}},items[1]))}}},[[347,1,2]]]);