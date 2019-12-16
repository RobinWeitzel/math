function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

example.Toolbar = Class.extend({

	init: function (elementId, view) {
		this.html = $("#" + elementId);
		this.view = view;

		// register this class as event listener for the canvas
		// CommandStack. This is required to update the state of 
		// the Undo/Redo Buttons.
		//
		view.getCommandStack().addEventListener(this);

		// Register a Selection listener for the state hnadling
		// of the Delete Button
		//
		view.on("select", $.proxy(this.onSelectionChanged, this));

		// Inject the UNDO Button and the callbacks
		//
		this.undoButton = $("<button>Undo</button>");
		this.html.append(this.undoButton);
		this.undoButton.button().click($.proxy(function () {
			this.view.getCommandStack().undo();
		}, this)).button("option", "disabled", true);

		// Inject the REDO Button and the callback
		//
		this.redoButton = $("<button>Redo</button>");
		this.html.append(this.redoButton);
		this.redoButton.button().click($.proxy(function () {
			this.view.getCommandStack().redo();
		}, this)).button("option", "disabled", true);

		this.delimiter = $("<span class='toolbar_delimiter'>&nbsp;</span>");
		this.html.append(this.delimiter);

		// Inject the DELETE Button
		//
		this.deleteButton = $("<button>Delete</button>");
		this.html.append(this.deleteButton);
		this.deleteButton.button().click($.proxy(function () {
			var node = this.view.getPrimarySelection();
			var command = new draw2d.command.CommandDelete(node);
			this.view.getCommandStack().execute(command);
		}, this)).button("option", "disabled", true);

		this.delimiter = $("<span class='toolbar_delimiter'>&nbsp;</span>");
		this.html.append(this.delimiter);

		// Inject the SAVE Button
		//
		this.saveButton = $("<button>Save</button>");
		this.html.append(this.saveButton);
		this.saveButton.button().click($.proxy(function () {
			this.view.save();

			var writer = new draw2d.io.json.Writer();
			writer.marshal(this.view, function(json) {
				download(JSON.stringify(json, null, 2), 'graph.json', 'text/plain');
			});
		}, this)).button("option", "disabled", false);

		// Inject the LOAD Button
		//
		this.loadButton = $("<button>Load</button>");
		this.html.append(this.loadButton);
		this.loadButton.button().click(function () {
			$('#file-input').trigger('click');
		}).button("option", "disabled", false);

		loadCompleted = $.proxy(function() {
			var reader = new draw2d.io.json.Reader();
	  		reader.unmarshal(this.view, JSON.parse(fr.result));
		}, this);

		$("#file-input").change(function (){
			if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
				alert('The File APIs are not fully supported in this browser.');
				return;
			}  

			input = document.getElementById('file-input');
			if (!input) {
			alert("Um, couldn't find the fileinput element.");
			}
			else if (!input.files) {
			alert("This browser doesn't seem to support the `files` property of file inputs.");
			}
			else if (!input.files[0]) {
			alert("Please select a file before clicking 'Load'");               
			} else {
				file = input.files[0];
				fr = new FileReader();
				fr.onload = loadCompleted;
				fr.readAsText(file);
				//fr.readAsDataURL(file);
			  }
		});
	},

	/**
	 * @method
	 * Called if the selection in the cnavas has been changed. You must register this
	 * class on the canvas to receive this event.
	 *
     * @param {draw2d.Canvas} emitter
     * @param {Object} event
     * @param {draw2d.Figure} event.figure
	 */
	onSelectionChanged: function (emitter, event) {
		this.deleteButton.button("option", "disabled", event.figure === null);
	},

	/**
	 * @method
	 * Sent when an event occurs on the command stack. draw2d.command.CommandStackEvent.getDetail() 
	 * can be used to identify the type of event which has occurred.
	 * 
	 * @template
	 * 
	 * @param {draw2d.command.CommandStackEvent} event
	 **/
	stackChanged: function (event) {
		this.undoButton.button("option", "disabled", !event.getStack().canUndo());
		this.redoButton.button("option", "disabled", !event.getStack().canRedo());
	}
});