example.ResultFigure = draw2d.shape.basic.Circle.extend({

    NAME: "example.ResultFigure",

    init : function()
    {
        this._super();

        this.setBackgroundColor("f0f0ff");
        this.setStroke(1);
        this.setDiameter(50);
        this.setResizeable(false);
        this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());

        this.result = new draw2d.shape.basic.Label({ text: "" });
        this.result.setStroke(0);
        this.result.setFontSize(16);
        this.add(this.result, new draw2d.layout.locator.CenterLocator(this));

        setPortCount(this, 1);
    },

    createSet: function(){
        var set = this._super();

        //set.push( this.canvas.paper.circle(20, 20, 10));
        return set;
    },

    calc: function() {
        var a = getSiblings(this.getInputPorts().data[0]);

        if(a.length >= 1) {
            this.result.setText(a[0].parameters.output.value);
        } else {
            this.result.setText("");
        }
    }
});
