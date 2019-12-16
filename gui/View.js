DataFigure = draw2d.shape.basic.Circle.extend({

    NAME: "Data",

    init : function()
    {
        this._super();

        this.setBackgroundColor("f0f0ff");
        this.setStroke(1);
        this.setDiameter(50);
        this.setResizeable(false);
        this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());

        this.label = new draw2d.shape.basic.Label({text:"2"});
        this.label.setStroke(0);
        this.label.setFontSize(16);

        this.add(this.label, new draw2d.layout.locator.CenterLocator(this));

        var output = this.createPort("output");
    },

    createSet: function(){
        var set = this._super();

        //set.push( this.canvas.paper.circle(20, 20, 10));
        return set;
    }
});

FunctionFigure = draw2d.shape.basic.Rectangle.extend({

    NAME: "Function",

    init : function()
    {
        this._super();

        this.setBackgroundColor("f0f0ff");
        this.setStroke(1);
        this.setDimension(50, 50);
        this.setResizeable(false);
        this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());

        this.label = new draw2d.shape.basic.Label({text:"+"});
        this.label.setStroke(0);
        this.label.setFontSize(24);

        this.add(this.label, new draw2d.layout.locator.CenterLocator(this));

        this.result = new draw2d.shape.basic.Label({text:"4"});
        this.result.setStroke(0);
        this.result.setFontSize(16);
        this.add(this.result, new draw2d.layout.locator.BottomLocator(this));

        var input = [this.createPort("input")];
        var output = [this.createPort("output")];
    },

    createSet: function(){
        var set = this._super();

        set.push( this.canvas.paper.circle(20, 20, 10));
        return set;
    }
});

ResultFigure = draw2d.shape.basic.Circle.extend({

    NAME: "Result",

    init : function()
    {
        this._super();

        this.setBackgroundColor("f0f0ff");
        this.setStroke(1);
        this.setDiameter(50);
        this.setResizeable(false);
        this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());

        /*this.label = new draw2d.shape.basic.Label({text:"2"});
        this.label.setStroke(0);
        this.label.setFontSize(16);

        this.add(this.label, new draw2d.layout.locator.CenterLocator(this));*/

        var input = this.createPort("input");
    },

    createSet: function(){
        var set = this._super();

        //set.push( this.canvas.paper.circle(20, 20, 10));
        return set;
    }
});

CommentFigure = draw2d.shape.basic.Label.extend({

    NAME: "Comment",

    init : function()
    {
        this._super();
        this.setDimension(50, 25);
        this.setStroke(0);
        this.setFontSize(16);

        this.setText("Comment");
    }
});

example.View = draw2d.Canvas.extend({
	
	init:function(id){
		this._super(id);
		
		this.setScrollArea("#"+id);
		
		this.currentDropConnection = null;
	},

    /**
     * @method
     * Called if the DragDrop object is moving around.<br>
     * <br>
     * Graphiti use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     * 
     * @param {HTMLElement} droppedDomNode The dragged DOM element.
     * @param {Number} x the x coordinate of the drag
     * @param {Number} y the y coordinate of the drag
     * 
     * @template
     **/
    onDrag:function(droppedDomNode, x, y )
    {
    },
    
    /**
     * @method
     * Called if the user drop the droppedDomNode onto the canvas.<br>
     * <br>
     * Draw2D use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     * 
     * @param {HTMLElement} droppedDomNode The dropped DOM element.
     * @param {Number} x the x coordinate of the drop
     * @param {Number} y the y coordinate of the drop
     * @param {Boolean} shiftKey true if the shift key has been pressed during this event
     * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     * @private
     **/
    onDrop : function(droppedDomNode, x, y, shiftKey, ctrlKey)
    {
        var type = $(droppedDomNode).data("shape");

        switch(type) {
            case "Data":
                var figure = new DataFigure();
                break;
            case "Function":
                var figure = new FunctionFigure();
                break;
            case "Result":
                var figure = new ResultFigure();
                break;
            case "Comment":
                var figure = new CommentFigure();
                break;
        }

        // create a command for the undo/redo support
        var command = new draw2d.command.CommandAdd(this, figure, x, y);
        this.getCommandStack().execute(command);
    }
});

