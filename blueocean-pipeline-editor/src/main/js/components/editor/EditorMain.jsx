// @flow

import React, { Component, PropTypes } from 'react';
import { EditorPipelineGraph } from './EditorPipelineGraph';
import { EditorStepList } from './EditorStepList';
import { EditorStepDetails } from './EditorStepDetails';

import type { StageInfo, StepInfo } from './common';

type Props = {
    stages: Array<StageInfo>,
    stageSteps: {[stageId:number]: Array<StepInfo> }
};

type State = {
    selectedStage: ?StageInfo
};

type DefaultProps = typeof EditorMain.defaultProps;

export class EditorMain extends Component<DefaultProps, Props, State> {

    static defaultProps = {};

    //static propTypes = {...}
    // TODO: React proptypes ^^^

    props:Props;
    state:State;

    constructor(props: Props) {
        super(props);
        this.state = {
            selectedStage: null // TODO: Allow a selected stage in props?
        };
    }

    getStepsForStage(stage:StageInfo):Array<StepInfo> {
        const stageId = stage.id;

        return this.props.stageSteps[stageId] || [];
    }

    graphSelectedStageChanged(newSelectedStage: ?StageInfo) {
        console.log("Changing selected stage to", newSelectedStage); // TODO: RM
        this.setState({selectedStage: newSelectedStage});
    }

    stageNodeClicked(name: String, id: number) {
        // TODO: Replace this contraption with a better event in EditorPipelineGraph
        console.log("stageNodeClicked", name, id); // TODO: RM
        const currentSelectedStage = this.state.selectedStage;
        if (currentSelectedStage && currentSelectedStage.id == id) {
            // Nothing to change here
            return;
        }

        const {stages} = this.props;
        let newSelectedStage = null;

        for (const stage of stages) {
            if (stage.id === id) {
                newSelectedStage = stage;
                break;
            }
        }

        if (!newSelectedStage) {
            console.error("Could not find stage",[name,id], "in stages list", stages);
            // TODO: Do we want to keep this here? Throw a proper error that rollbar can see instead?
        }

        this.graphSelectedStageChanged(newSelectedStage);
    }

    render() {

        const {stages} = this.props;
        const {selectedStage} = this.state;
        const steps = selectedStage ? this.getStepsForStage(selectedStage) : [];

        return (
            <div className="editor-main">
                <div className="editor-main-graph">
                    <EditorPipelineGraph stages={stages} onNodeClick={(name, id) => this.stageNodeClicked(name,id)}/>
                </div>
                <div className="editor-main-step-list">
                    <EditorStepList steps={steps}/>
                </div>
                <div className="editor-main-step-details">
                    <EditorStepDetails/>
                </div>
            </div>
        );
    }
}
