String.prototype.leftPad = function(len) {
    var str = this;
    while (str.length < len) str = "0" + str;
    
    return str;
}

var AgileBoard = function(selector, data){
    if(typeof data == "undefined"){
        data = localStorage.getItem("agileBoard");
        data = JSON.parse(data);
    }

    AgileBoard.target = document.querySelector(selector);
    AgileBoard.data = data

    return AgileBoard;
}

AgileBoard.getTemplateTask = function(){
    return `
        <aside>
            <task-id contenteditable="false">__ID__</task-id>
            <button class="fa fa-expand"
                    onclick="AgileBoard.toggleExpand(this)">
            </button>
            <button class="fa fa-pencil" 
                    onclick="AgileBoard.toggleEdit(this)">
            </button>
            <button class="fa fa-trash-o"
                    onclick="AgileBoard.remove(this)">
            </button>
        </aside>
        <task-title contenteditable="false">
            __TITLE__
        </task-title>
        <b>Descripción: </b>
        <task-legend contenteditable="false">
            __DESCRIPTION__
        </task-legend>
        <b>Asignada a: </b>
        <task-assigned contenteditable="false">
            __USERNAME__
        </task-assigned>`;
}

AgileBoard.toggleExpand = function(e){
    var item = e.parentElement.parentElement;

    item.classList.toggle("collapsed");
}

AgileBoard.toggleEdit = function(e){
    var item = e.parentElement.parentElement;
    var title = item.querySelector("task-title");
    var desc = item.querySelector("task-legend");
    var user = item.querySelector("task-assigned");

    if(title.getAttribute("contenteditable") == "true"){
        title.setAttribute("contenteditable", "false");
        desc.setAttribute("contenteditable", "false");
        user.setAttribute("contenteditable", "false");

        this.saveAll();

    } else {
        title.setAttribute("contenteditable", "true");
        desc.setAttribute("contenteditable", "true");
        user.setAttribute("contenteditable", "true");
    }

    item.classList.toggle("editing")
}

AgileBoard.remove = function(e){
    e.parentElement.parentElement.remove();

    this.saveAll();
}

AgileBoard.saveAll = function(){
    var items = document.querySelectorAll(".agileDashboard .task");
    var tasks = [];
    for(var x = 0; x < items.length; x++){
        var item = items[x];
        var abbr = this.data.project.abbreviature;

        var id    = item.querySelector("task-id").innerHTML;
            id    = id.replace(abbr+'-', '');
        var stage = item.parentElement.getAttribute("class");
        var title = item.querySelector("task-title").
                    innerHTML.trim();
        var desc  = item.querySelector("task-legend").
                    innerHTML.trim();
        var user  = item.querySelector("task-assigned").
                    innerHTML.trim();

        var task = { id: id, name: title, description: desc, assigned: user, stage: stage};
        tasks.push(task);

        this.data.tasks = tasks;

        localStorage.setItem("agileBoard", JSON.stringify(this.data));
    }
}

AgileBoard.create = function(){
    // Añadimos la sección de identificación
    var divHeader = document.createElement("div");
    divHeader.innerHTML = `
    <div>
        <h1>Agile Board 1.0</h1>
        <h2>Proyecto: <b>` + this.data.project.name +  `</b></h2>
        <div class="buttons">
            <button class="add fa fa-plus" 
                    onclick="AgileBoard.newTask()">
            </button>
            <button class="close-project fa fa-sign-out"></button>
        </div>
    </div>`;

    this.target.appendChild(divHeader);

    // Añadimos los nombres de las etapas o fases disponibles
    var divStages = document.createElement("div");
        divStages.classList.add("stages")

    for(var x = 0; x < this.data.stages.length; x++){
        var stage = this.data.stages[x];
        
        var item = document.createElement("article");
        item.innerHTML = "<header>" + stage + "</header>";

        divStages.appendChild(item);
    }
    this.target.appendChild(divStages);

    // Añadimos las etapas o fases disponibles
    for(var x = 0; x < this.data.stages.length; x++){
        var stage = this.data.stages[x];

        // Creamos el contenedor y le configuramos para que
        // pueda ser utilizado con la tecnología Drag & Drop
        var item = document.createElement("article");
        item.classList.add(stage.replace(/ /mg, ""))
        item.setAttribute("onDrop", 
                          "AgileBoard.dropItem(this, event)"
        );
        item.setAttribute("onDragEnter", "return false");
        item.setAttribute("onDragOver", "return false");

        this.target.appendChild(item);
    }

    // Añadimos las tareas definidas
    for(var x = 0; x < this.data.tasks.length; x++){
        var task = this.data.tasks[x];

        var tmpl = this.getTemplateTask();
        tmpl = tmpl.replace("__ID__", AgileBoard.getID(task.id));
        tmpl = tmpl.replace("__TITLE__", task.name);
        tmpl = tmpl.replace("__DESCRIPTION__", task.description);
        tmpl = tmpl.replace("__USERNAME__", task.assigned);
        
        // Creamos el elemento "tarea" y la configuramos para que
        // pueda ser utilizado con la tecnología Drag & Drop y
        // pueda ser arrastrable
        var item = document.createElement("div");
        item.id = AgileBoard.getID(task.id);
        item.classList.add("task", "collapsed");
        item.setAttribute("draggable", "true");
        item.setAttribute("draggable", "true");
        item.setAttribute("onDragStart", 
                          "AgileBoard.dragItem(this, event)"
        );
        item.innerHTML = tmpl;              

        this.target.querySelector("." + task.stage.replace(/ /mg, '')).appendChild(item);
    }

    // Añadimos las reglas CSS
    this.addStyles();
}

AgileBoard.dragItem = function(item, event) {
    event.dataTransfer.setData('Identificador', item.id)
}

AgileBoard.dropItem = function(target, event) {
    var item = event.dataTransfer.getData('Identificador');
    target.appendChild(document.getElementById(item));

    this.saveAll();
}

AgileBoard.getID = function(id){
    return this.data.project.abbreviature + "-" + 
            id.toString().leftPad(4);
}

AgileBoard.getNewTaskID = function(){
    return this.data.project.abbreviature + "-" + 
            (this.data.tasks.length + 1).toString().leftPad(4);
}

AgileBoard.newTask = function(){
    var tmpl = this.getTemplateTask();
    tmpl = tmpl.replace("__ID__", AgileBoard.getNewTaskID());
    tmpl = tmpl.replace("__TITLE__", "Introduce un título");
    tmpl = tmpl.replace("__DESCRIPTION__", 
                        "Introduce una descripción");
    tmpl = tmpl.replace("__USERNAME__", "Sin Asignar");
    
    // Creamos la tarea
    var item = document.createElement("div");
    item.id = AgileBoard.getNewTaskID();
    item.classList.add("task", "editing");
    item.setAttribute("draggable", "true");
    item.setAttribute("draggable", "true");
    item.setAttribute("onDragStart", 
                      "AgileBoard.dragItem(this, event)");
    item.innerHTML = tmpl;              

    this.target.querySelector("." + this.data.stages[0].
                replace(/ /mg, '')).appendChild(item);

    // La ponemos en modo edición
    var title = item.querySelector("task-title");
    var desc = item.querySelector("task-legend");
    var user = item.querySelector("task-assigned");

    title.setAttribute("contenteditable", "true");
    desc.setAttribute("contenteditable", "true");
    user.setAttribute("contenteditable", "true");

    var task = { id: item.id.replace(this.data.project.abbreviature+'-', ''),
                    name: title.innerHTML,
                    description: desc.innerHTML,
                    stage: this.data.stages[0]
                };
    this.data.tasks.push(task);

    localStorage.setItem("agileBoard", JSON.stringify(this.data));
}

AgileBoard.addStyles = function(){
    // Añadimos la fuente de iconos vectoriales
    var link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.href = " https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
    document.head.appendChild(link);

    // Añadimos la fuente Open Sans de Google Fonts
    var link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.href = "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700&display=swap";
    document.head.appendChild(link);

    // Añadimos la fuente Roboto de Google Fonts
    var link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.href = "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&display=swap";
    document.head.appendChild(link);

    // Creamos un contenedor style para añadir las reglas
    var styles = document.createElement("style");
    styles.setAttribute("title", "Agile Board StyleSheet");
    styles.setAttribute("rel", "stylesheet");
    styles.appendChild(document.createTextNode(""));
    document.head.insertBefore(
        styles, 
        document.head.childNodes[0]
    );

    // Recuperamos el objeto CSSStyleSheet asociado 
    // al elemento que acabamos de crear
    var styleSheet = styles.sheet;

    // Añadimos las reglas para el body
    styleSheet.addRule("body", "margin: 0; padding: 0;");
    styleSheet.addRule("body *", `outline: none;`);

    // Añadimos la regla del componente al elemento destino
    this.target.classList.add("agileDashboard");
    
    // Definimos las reglas necesarias
    styleSheet.addRule(".agileDashboard", `
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        box-sizing: content-box;
        display: block;
        background: rgba(0,127,224,1);
        background: linear-gradient(rgb(35, 78, 158) 0%, rgb(70, 126, 232) 100%);
    `);

    styleSheet.addRule(".agileDashboard > div", `
        font-family: "Roboto", sans-serif;
        background: linear-gradient(to bottom, #2c539e 0%,#1c438e 100%);
    `);

    styleSheet.addRule(".agileDashboard div h1", `
        display: inline-block;
        font-size: 18px;
        font-weight: 300;
        text-transform: uppercase;
        line-height: 32px;
        padding: 0 10px;
        margin: 0;
        color: lightskyblue;
    `);
    
    styleSheet.addRule(".agileDashboard div h2", `
        display: inline-block;
        font-size: 14px;
        font-weight: 300;
        text-transform: uppercase;
        line-height: normal;
        padding: 0 10px;
        margin: 0;
        color: yellowgreen;
        position: relative;
        top: -1px;
    `);

    styleSheet.addRule(".agileDashboard div h2 b", `
        color: #fff;
    `);

    styleSheet.addRule(".agileDashboard div .buttons", `
        display: block;
        text-transform: uppercase;
        line-height: 32px;
        padding: 0 4px;
        margin: 0;
        float: right;
    `);

    styleSheet.addRule(".agileDashboard > div button", `
        background: rgba(255,255,255,0.5);
        border: 0 none;
        color: #fff;
        font-size: 14px;
        height: 26px;
        width: 26px;
    `);

    styleSheet.addRule(".agileDashboard .stages > article ", `
        width: 16.6666%;
        display: block;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        text-align: center;
        text-transform: uppercase;
        font-family: "Open Sans", sans-serif;
        float: left;
        border-right: 1px solid rgba(255,255,255,0.05);
    `);

    styleSheet.addRule(".agileDashboard > article ", `
        width: 16.6666%;
        height: calc(100% - 32px);
        overflow: auto;
        display: block;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        text-align: center;
        text-transform: uppercase;
        font-family: "Open Sans", sans-serif;
        float: left;
        border-right: 1px solid rgba(255,255,255,0.05);
        scrollbar-width: thin;
    `);
    styleSheet.addRule(".agileDashboard article header ", `
        color: #fff;
        border-bottom: 1px solid #000;
        background: linear-gradient(to bottom, #2c539e 0%,#1c438e 100%);;
        height: 32px;
        padding: 0;
        line-height: 34px;
    `);
    
    styleSheet.addRule(".agileDashboard .task ", `
        margin: 5px;
        padding: 0;
        width: auto;
        display: block;
        background: linear-gradient(to right, rgb(44, 83, 158) 0%, rgb(28, 67, 142) 100%);
        min-height: 48px;
        box-shadow: 0 0 0 1px rgba(0,0,0,0.25);
        cursor: move;
    `);
    styleSheet.addRule(".agileDashboard .task aside ", `
        float: right;
        width: 100%;
        text-align: right;
        padding: 5px 0;
        background: linear-gradient(to bottom, #2c539e 0%,#1c438e 100%);
        display: block;
        position: relative;
        /*box-shadow: 0 0 0 1px #0066ee inset;*/
    `);
    styleSheet.addRule(".agileDashboard .task aside button ", `
        background: transparent;
        border: 0 navajowhite;
        color: #e4bdad;
        width: 24px;
        cursor: pointer;
    `);
    styleSheet.addRule(`
        .agileDashboard .task task-title,
        .agileDashboard .task task-title + b,
        .agileDashboard .task task-legend,
        .agileDashboard .task task-legend + b,
        .agileDashboard .task task-assigned `, `
            display: inline-block;
            text-align: justify;
            font-size: 12px;
            text-transform: none;
            line-height: normal;
            padding: 5px;
            margin: 0;
            width: 100%;
            word-break: break-word;
            box-sizing: border-box;
            position: relative;
            color: #fff;
    `);
    
    styleSheet.addRule(`
        .agileDashboard .task task-title,
        .agileDashboard .task task-title + b,
        .agileDashboard .task task-legend + b`, `
            color: lightsteelblue;
            font-weight: 100;
    `);

    styleSheet.addRule(".agileDashboard .task task-id ", `
        color: #fff;
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        max-width: calc(100% - 85px);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        padding: 0 0 0 10px;
        display: inline-block;
        text-align: justify;
        font-size: 13px;
        text-transform: uppercase;
        line-height: 30px;
        padding-left: 7px;
        margin: 0;
        width: 100%;
        box-sizing: border-box;
    `);

    styleSheet.addRule(`
            .agileDashboard .task task-legend,
            .agileDashboard .task task-assigned`, `
            color: rgba(255,255,255,0.9);
    `);

    for(var x = 0; x < this.data.stages.length; x++){
        var stage      = this.data.stages[x].replace(/ /mg, '');
        var stageColor = this.data.stagesColors[x];

        styleSheet.addRule(
            `.agileDashboard .` + stage + ` .task task-id,
                .agileDashboard .` + stage + ` .task task-title,
                .agileDashboard .` + stage + ` .task task-title + b,
                .agileDashboard .` + stage + ` .task task-legend,
                .agileDashboard .` + stage + ` .task task-legend + b,
                .agileDashboard .` + stage + ` .task task-assigned`, `
                border-left: 3px solid ` + stageColor + `;
        `);

        styleSheet.addRule(`.agileDashboard article.` + stage + ` header`, `
            border-color: ` + stageColor + `;
        `);
    }

    styleSheet.addRule(".agileDashboard .task task-title:after ", `
        border-bottom: 1px solid rgba(0,0,0,0.1);
        content: "";
        position: absolute;
        width: 100%;
        overflow: hidden;
        height: 0;
        left: 0;
        bottom: 0px;
        z-index: 3;
    `);

    styleSheet.addRule(".agileDashboard .task task-title + b:after ", `
        border-bottom: 1px solid rgba(255,255,255,0.05);
        content: "";
        position: absolute;
        width: 100%;
        overflow: hidden;
        height: 0;
        left: 0;
        top: 0px;
        z-index: 3;
    `);

    styleSheet.addRule(`
        .agileDashboard .task.editing > *`, `
            background: #323538;
    `);
    styleSheet.addRule('.agileDashboard .task.editing aside .fa-pencil::before ', `
        content: "\\f0c7"
    `);

    styleSheet.addRule('.agileDashboard .task:not(.collapsed) aside .fa-expand::before ', `
        content: "\\f066";
    `);

    styleSheet.addRule(`.agileDashboard .task.collapsed b,
        .agileDashboard .task.collapsed task-legend,
        .agileDashboard .task.collapsed task-assigned`, `
            display: none;
    `);

    styleSheet.addRule(".agileDashboard .task [contenteditable='true'] ", `
        cursor: auto;
    `);

    try{
        styleSheet.addRule(`::-webkit-scrollbar`, `width: 5px;`);
        styleSheet.addRule(`::-webkit-scrollbar-track`, `background: rgba(0,0,0,0.1);`);
        styleSheet.addRule(`::-webkit-scrollbar-thumb`, `background: rgba(0,0,0,0.2);`);
        styleSheet.addRule(`::-webkit-scrollbar-thumb:hover`, `background: rgba(0,0,0,0.4);`);
    } catch(e) {}
}

