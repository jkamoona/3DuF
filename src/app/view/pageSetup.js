import {setButtonColor} from "../utils/htmlUtils";

var HTMLUtils = require("../utils/htmlUtils");
var Registry = require("../core/registry");
var Colors = require("./colors");
var JSZip = require("jszip");
var ParameterMenu = require("./UI/parameterMenu");
var InsertTextTool = require("./tools/insertTextTool");

let activeButton = null;
let activeLayer = null;

let revertdefaultsButton = document.getElementById("revertdefaults_button");
let alignmentMarksParams = document.getElementById("alignmentmarks_params_button");

let channelParams = document.getElementById("channel_params_button");
let connectionParams = document.getElementById("connection_params_button");
let roundedChannelParams = document.getElementById("roundedchannel_params_button");
let transitionParams = document.getElementById("transition_params_button");
let circleValveParams = document.getElementById("circleValve_params_button");
let valveParams = document.getElementById("valve_params_button");
let valve3dParams = document.getElementById("valve3d_params_button");
let portParams = document.getElementById("port_params_button");
let viaParams = document.getElementById("via_params_button");
let chamberParams = document.getElementById("chamber_params_button");
let diamondParams = document.getElementById("diamond_params_button");
let bettermixerParams = document.getElementById("bettermixer_params_button");
let curvedmixerParams = document.getElementById("curvedmixer_params_button");
let mixerParams = document.getElementById("mixer_params_button");
let gradientGeneratorParams = document.getElementById("gradientgenerator_params_button");
let treeParams = document.getElementById("tree_params_button");
let ytreeParams = document.getElementById("ytree_params_button");
let muxParams = document.getElementById("mux_params_button");
let transposerParams = document.getElementById("transposer_params_button");
let rotarymixerParams = document.getElementById("rotarymixer_params_button");
let dropletgenParams = document.getElementById("dropletgen_params_button");
let celltraplParams = document.getElementById("celltrapl_params_button");

let jsonButton = document.getElementById("json_button");
let interchangeV1Button = document.getElementById("interchange_button");
let svgButton = document.getElementById("svg_button");

//let stlButton = document.getElementById("stl_button");

let button2D = document.getElementById("button_2D");
//let button3D = document.getElementById("button_3D");

// let cellsButton = document.getElementById("cells_button");

let inactiveBackground = Colors.GREY_200;
let inactiveText = Colors.BLACK;
let activeText = Colors.WHITE;

let canvas = document.getElementById("c");

let canvasBlock = document.getElementById("canvas_block");
let renderBlock = document.getElementById("renderContainer");

let renderer;
let view;

let threeD = false;

let saveDeviceSettingsButton = document.getElementById("accept_resize_button");

let acceptTextButton = document.getElementById("accept_text_button");

// let layerButtons = {
//     "0": flowButton,
//     "1": controlButton,
//     "2": cellsButton
// };

let layerIndices = {
    "0": 0,
    "1": 1,
    "2": 2
};

let zipper = new JSZip();

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}



function switchTo3D() {
    if (!threeD) {
        threeD = true;
        setButtonColor(button3D, Colors.getDefaultLayerColor(Registry.currentLayer), activeText);
        setButtonColor(button2D, inactiveBackground, inactiveText);
        renderer.loadJSON(Registry.currentDevice.toJSON());
        let cameraCenter = view.getViewCenterInMillimeters();
        let height = Registry.currentDevice.params.getValue("height") / 1000;
        let pixels = view.getDeviceHeightInPixels();
        renderer.setupCamera(cameraCenter[0], cameraCenter[1], height, pixels, paper.view.zoom);
        renderer.showMockup();
        HTMLUtils.removeClass(renderBlock, "hidden-block");
        HTMLUtils.addClass(canvasBlock, "hidden-block");
        HTMLUtils.addClass(renderBlock, "shown-block");
        HTMLUtils.removeClass(canvasBlock, "shown-block");
    }
}


//TODO: transition backwards is super hacky. Fix it!

function paramsWindowFunction(typeString, setString, isTranslucent = false) {
    var makeTable = ParameterMenu.generateTableFunction("parameter_menu", typeString, setString , isTranslucent);
    return function(event) {
        Registry.viewManager.killParamsWindow();
        makeTable(event);
    }
}

function setupAppPage() {
    view = Registry.viewManager.view;
    renderer = Registry.threeRenderer;

    //Register all the button clicks here


    saveDeviceSettingsButton.onclick = function(){

        //Save the name
        let devicename = document.getElementById("devicename_textinput").value;
        if(devicename != "" || devicename != null){
            console.log("test");
            Registry.currentDevice.setName(devicename);
        }

        //Do the resizing
        let xspan = document.getElementById("xspan_textinput").value;
        let yspan = document.getElementById("yspan_textinput").value;
        console.log("Resizing the device to: " + xspan + ", " +yspan);


        if(xspan != "" && yspan != ""){

            //Convert the dimensions to microns from mm
            Registry.currentDevice.setXSpan(xspan*1000);
            Registry.currentDevice.setYSpan(yspan*1000);

            //Update the device borders
            Registry.viewManager.generateBorder();

            //Close the dialog
            var dialog = document.querySelector('dialog');
            dialog.close();

            //Refresh the view
            Registry.viewManager.view.initializeView();
            Registry.viewManager.view.refresh();
            // Registry.viewManager.view.updateGrid();
            Registry.viewManager.view.updateAlignmentMarks();
        }

    };


    acceptTextButton.onclick = function(){
        Registry.viewManager.activateTool("InsertTextTool");
        Registry.text = document.getElementById("inserttext_textinput").value;
        let textLabelDialog = document.getElementById('insert_text_dialog');
        textLabelDialog.close();
    };


    // revertdefaultsButton.onclick = function() {
    //     Registry.viewManager.revertFeaturesToDefaults(Registry.viewManager.view.getSelectedFeatures());
    //
    // };
/*
    copyButton.onclick = function() {

    }
*/
    //copyButton.onclick = function() {

    //}

    //Setup Tool Handlers
    // flowButton.onclick = function() {
    //     if (threeD) {
    //         if (activeLayer == "0") renderer.toggleLayerView(0);
    //         else renderer.showLayer(0);
    //     }
    //     Registry.currentLayer = Registry.currentDevice.layers[0];
    //     setActiveLayer("0");
    //     Registry.viewManager.updateActiveLayer();
    //
    // };
    //
    // controlButton.onclick = function() {
    //     if (threeD) {
    //         if (activeLayer == "1") renderer.toggleLayerView(1);
    //         else renderer.showLayer(1);
    //     }
    //     Registry.currentLayer = Registry.currentDevice.layers[1];
    //     setActiveLayer("1");
    //     Registry.viewManager.updateActiveLayer();
    // };


    // cellsButton.onclick = function() {
    //     if (threeD) {
    //         if (activeLayer == "2") renderer.toggleLayerView(2);
    //         else renderer.showLayer(2);
    //     }
    //     Registry.currentLayer = Registry.currentDevice.layers[2];
    //     setActiveLayer("2");
    //     Registry.viewManager.updateActiveLayer();
    //     console.log("Adaptive Grid Min Spacing: " + Registry.currentGrid.minSpacing);
    //     console.log("Adaptive Grid Max Spacing: " + Registry.currentGrid.maxSpacing);
    //
    // };

    interchangeV1Button.onclick = function() {
        let json = new Blob([JSON.stringify(Registry.currentDevice.toInterchangeV1())], {
            type: "application/json"
        });
        saveAs(json, "device.json");
    };

    /*
        stlButton.onclick = function() {
            let json = Registry.currentDevice.toJSON();
            let stls = renderer.getSTL(json);
            let blobs = [];
            let zipper = new JSZip();
            for (let i = 0; i < stls.length; i++) {
                let name = "" + i + "_" + json.name + "_" + json.layers[i].name + ".stl";
                zipper.file(name, stls[i]);
            }
            let content = zipper.generate({
                type: "blob"
            });
            saveAs(content, json.name + "_layers.zip");
        }
    */
    svgButton.onclick = function() {
        let svgs = Registry.viewManager.layersToSVGStrings();
        //let svg = paper.project.exportSVG({asString: true});
        let blobs = [];
        let success = 0;
        let zipper = new JSZip();
        for (let i = 0; i < svgs.length; i++) {
            if (svgs[i].slice(0, 4) == "<svg") {
                zipper.file("Device_layer_" + i + ".svg", svgs[i]);
                success++;
            }
        }

        if (success == 0) throw new Error("Unable to generate any valid SVGs. Do all layers have at least one non-channel item in them?");
        else {
            let content = zipper.generate({
                type: "blob"
            });
            saveAs(content, "device_layers.zip");
        }
    };

    // button2D.onclick = function() {
    //   /*  killParamsWindow();
    //     switchTo2D();*/
    // };

  //  button3D.onclick = function() {
       /* killParamsWindow();
        switchTo3D();*/
    //}

    channelParams.onclick = paramsWindowFunction("Channel", "Basic");
    connectionParams.onclick = paramsWindowFunction("Connection", "Basic");
    roundedChannelParams.onclick = paramsWindowFunction("RoundedChannel", "Basic");
    circleValveParams.onclick = paramsWindowFunction("CircleValve", "Basic");
    valve3dParams.onclick = paramsWindowFunction("Valve3D", "Basic");
    valveParams.onclick = paramsWindowFunction("Valve", "Basic");
    portParams.onclick = paramsWindowFunction("Port", "Basic");
    viaParams.onclick = paramsWindowFunction("Via", "Basic");
    chamberParams.onclick = paramsWindowFunction("Chamber", "Basic");
    diamondParams.onclick = paramsWindowFunction("DiamondReactionChamber", "Basic");
    bettermixerParams.onclick = paramsWindowFunction("BetterMixer", "Basic");
    curvedmixerParams.onclick = paramsWindowFunction("CurvedMixer", "Basic");
    mixerParams.onclick = paramsWindowFunction("Mixer", "Basic");
    gradientGeneratorParams.onclick = paramsWindowFunction("GradientGenerator", "Basic");
    treeParams.onclick = paramsWindowFunction("Tree", "Basic");
    ytreeParams.onclick = paramsWindowFunction("YTree", "Basic");
    muxParams.onclick = paramsWindowFunction("Mux", "Basic");
    transposerParams.onclick = paramsWindowFunction("Transposer", "Basic");
    rotarymixerParams.onclick = paramsWindowFunction("RotaryMixer", "Basic");
    dropletgenParams.onclick = paramsWindowFunction("DropletGen", "Basic");
    transitionParams.onclick = paramsWindowFunction("Transition", "Basic");
    celltraplParams.onclick = paramsWindowFunction("CellTrapL", "Basic");
    alignmentMarksParams.onclick = paramsWindowFunction("AlignmentMarks", "Basic");

    function setupDragAndDropLoad(selector) {
        let dnd = new HTMLUtils.DnDFileController(selector, function(files) {
            var f = files[0];

            var reader = new FileReader();
            reader.onloadend = function(e) {
                var result = JSON.parse(this.result);
                Registry.viewManager.loadDeviceFromJSON(result);
                switchTo2D();
            };
            try {
                reader.readAsText(f);
            } catch (err) {
                console.log("unable to load JSON: " + f);
            }
        });
    }

    setupDragAndDropLoad("#c");
    setupDragAndDropLoad("#renderContainer");
    //setActiveButton("Channel");
    //setActiveLayer("0");
    Registry.viewManager.switchTo2D();

}

module.exports.setupAppPage = setupAppPage;
module.exports.paramsWindowFunction = paramsWindowFunction;
