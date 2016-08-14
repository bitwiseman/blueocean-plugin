// @flow

import React, {Component, PropTypes} from 'react';
import { storiesOf } from '@kadira/storybook';
import {EditorPipelineGraph, defaultLayout} from '../components/editor/EditorPipelineGraph';
import {EditorStepList} from '../components/editor/EditorStepList';
import {EditorMain} from '../components/editor/EditorMain';
import {EditorStepDetails} from '../components/editor/EditorStepDetails';

import type {StepInfo, StageInfo} from '../components/editor/common';

let __id = 1;

storiesOf('Pipeline Editor Main', module)
    .add('Basic', renderMainBasic)
;

storiesOf('Pipeline Editor Graph', module)
    .add('Basic', renderPiplineFlat)
    .add('Mixed', renderPipelineMixed)
    .add('Duplicate Names', renderPipelineDupNames)
;

storiesOf('Pipeline Editor Step List', module)
    .add('Basic', renderStepsBasic)
    .add('Nesting', renderStepsNesting)
    .add('More Nesting', renderStepsNestingDeeper)
;

storiesOf('Pipeline Editor Step Details', module)
    .add('Basic', renderStepDetailsBasic)
;

//--[ Main Wrapper ]----------------------------------------------------------------------------------------------------

const mainContainerStyle = {
    margin: "1em"
};

function renderMainBasic() {

    const stages = [
        makeStage("Build"),
        makeStage("Test"),
        makeStage("Deploy")
    ];

    let stageSteps = {};
    stageSteps[stages[0].id] = [makeStep("Echo"), makeStep("Run Script"), makeStep("Echo")];

    stageSteps[stages[1].id] = [makeStep("Run Script")];

    stageSteps[stages[2].id] = [
        makeStep("Echo"),
        makeStep("Run Script"),
        makeStep("Retry", [
            makeStep("Echo"),
            makeStep("Run Script"),
            makeStep("Run Script"),
            makeStep("Run Script"),
            makeStep("Echo")])];

    return (
        <div style={mainContainerStyle}>
            <EditorMain stages={stages} stageSteps={stageSteps}/>
        </div>
    );
}

//--[ Step Details Editor ]---------------------------------------------------------------------------------------------

function renderStepDetailsBasic() {
    return (
        <EditorStepDetails/>
    );
}

//--[ Main Wrapper ]----------------------------------------------------------------------------------------------------

const stepsContainerStyle = {maxWidth: "50em", margin: "2em"};

function renderStepsBasic() {
    const steps = [
        makeStep("Echo"),
        makeStep("Run Script"),
        makeStep("Maven"),
        makeStep("NPM")
    ];

    function addStepClicked() {
        console.log("Add step");
    }

    function stepSelected(step) {
        console.log("Step Selected", step);
    }

    function deleteStepClicked(step) {
        console.log("Delete step", step);
    }

    return (
        <div style={stepsContainerStyle}>
            <EditorStepList steps={steps}
                            onAddStepClick={addStepClicked}
                            onStepSelected={stepSelected}
                            onDeleteStepClick={deleteStepClicked}/>
        </div>
    );
}

function renderStepsNesting() {
    const steps = [
        makeStep("Echo"),
        makeStep("Run Script"),
        makeStep("Retry", [
            makeStep("Echo"),
            makeStep("Run Script"),
            makeStep("Run Script"),
            makeStep("Run Script"),
            makeStep("Echo")
        ]),
        makeStep("NPM")
    ];

    return (
        <div style={stepsContainerStyle}>
            <EditorStepList steps={steps}/>
        </div>
    );
}

function renderStepsNestingDeeper() {
    const steps = [
        makeStep("Echo"),
        makeStep("Retry", [
            makeStep("Echo"),
            makeStep("Run Script"),
            makeStep("Retry", [
                makeStep("Echo"),
                makeStep("Run Script"),
                makeStep("Run Script"),
                makeStep("Run Script"),
                makeStep("Echo")
            ]),
            makeStep("Echo")
        ]),
    ];

    return (
        <div style={stepsContainerStyle}>
            <EditorStepList steps={steps}/>
        </div>
    );
}

function makeStep(kind, nestedSteps?:Array<StepInfo>):StepInfo {
    const id = __id++;
    const children = nestedSteps || [];
    const isContainer = !!children.length;
    return {
        id,
        kind,
        isContainer,
        children
    };
}

//--[ Pipeline Graph ]--------------------------------------------------------------------------------------------------

function renderPiplineFlat() {

    const stages = [
        makeStage("Ken"),
        makeStage("Sagat"),
        makeStage("Ryu"),
        makeStage("Guile")
    ];

    // Reduce spacing just to make this graph smaller
    const layout = {nodeSpacingH: 90};

    function onNodeClick(a, b) {
        console.log("Node clicked", a, b);
    }

    return <div><EditorPipelineGraph stages={stages} layout={layout} onNodeClick={onNodeClick}/></div>;
}

function renderPipelineDupNames() {

    const stages = [
        makeStage("Build"),
        makeStage("Test"),
        makeStage("Browser Tests", [
            makeStage("Internet Explorer"),
            makeStage("Chrome")
        ]),
        makeStage("Test"),
        makeStage("Staging"),
        makeStage("Production")
    ];

    return (
        <div>
            <EditorPipelineGraph stages={stages}/>
        </div>
    );
}

function renderPipelineMixed() {

    const stages = [
        makeStage("Build"),
        makeStage("Test", [
            makeStage("JUnit"),
            makeStage("DBUnit"),
            makeStage("Jasmine")
        ]),
        makeStage("Browser Tests", [
            makeStage("Firefox"),
            makeStage("Edge"),
            makeStage("Safari"),
            makeStage("Chrome")
        ]),
        makeStage("Dev"),
        makeStage("Staging"),
        makeStage("Production", [
            makeStage("us-east-1"),
            makeStage("us-west-1 "),
            makeStage("us-west-2"),
            makeStage("ap-south-1")
        ])
    ];

    return <div><EditorPipelineGraph stages={stages} selectedStage={stages[0]}/></div>;
}

/// Simple helper for data generation
function makeStage(name, children = []):StageInfo {
    const id = __id++;
    return {name, children, id};
}
