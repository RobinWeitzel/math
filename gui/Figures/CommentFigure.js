example.CommentFigure = draw2d.shape.basic.Label.extend({

    NAME: "example.CommentFigure",

    init : function()
    {
        this._super();
        this.setDimension(50, 25);
        this.setStroke(0);
        this.setFontSize(16);

        this.setText("Comment");

        this.installEditor(new draw2d.ui.LabelInplaceEditor());
    }
});
