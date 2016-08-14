// @flow

import React, { Component, PropTypes } from 'react';
import { getAddIconGroup, getGrabIconGroup, getDeleteIconGroup } from './common';

import type {StepInfo} from './common';

type Props = {
    steps: Array<StepInfo>,
    selectedStep?: StepInfo,
    onAddStepClick?: () => any,
    onStepSelected?: (step:StepInfo) => any,
    onDeleteStepClick?: (step:StepInfo) => any,
    onAddChildStepClick?: (step:StepInfo) => any
}

type State = {
    selectedStep: ?StepInfo
};

type DefaultProps = typeof EditorStepList.defaultProps;

export class EditorStepList extends Component<DefaultProps, Props, State> {

    static defaultProps = {
        steps: []
    };

    //static propTypes = {...}
    // TODO: React proptypes ^^^

    props:Props;
    state:State;

    constructor(props:Props) {
        super(props);
        this.state = {selectedStep: props.selectedStep};
    }

    renderStep(step:StepInfo, selectedStep:?StepInfo) {

        let classNames = ["editor-step"];

        if (step === selectedStep) {
            classNames.push("selected");
        }

        let children = null;

        if (step.isContainer && step.children && step.children.length) {
            children = (
                <div className="editor-nested-steps">
                    { step.children.map(step => this.renderStep(step, selectedStep)) }
                </div>
            );
        }

        const addStepButton = (step.isContainer) ? (
            <span className="add-step-button" onClick={(e) => this.addChildStepClicked(step, e)}>
                <svg width="24" height="24">
                    <g transform="translate(12,12)">{ getAddIconGroup(12) }</g>
                </svg>
                Add {step.kind} step
            </span>
        ) : null;

        return (
            <div className={classNames.join(' ')} key={'s_' + step.id}>
                <div className="editor-step-grab">
                    <svg width="24" height="24">
                        <g transform="translate(12,12)">{ getGrabIconGroup() }</g>
                    </svg>
                </div>
                <div className="editor-step-main" onClick={(e) => this.stepClicked(step, e)}>
                    <div className="editor-step-content">
                        <div className="editor-step-title">
                            <span className="editor-step-label">{step.kind}</span>
                            <svg width="24"
                                 height="24"
                                 className="delete-step-button"
                                 onClick={(e) => this.deleteStepClicked(step, e)}>
                                <g transform="translate(12,12)">{ getDeleteIconGroup(12) }</g>
                            </svg>
                        </div>
                        {children}
                        {addStepButton}
                    </div>

                </div>
            </div>
        );
    }

    deleteStepClicked(step:StepInfo, e:Event) {
        e.stopPropagation(); // Don't bubble up to parent

        const {onDeleteStepClick} = this.props;

        if (onDeleteStepClick) {
            onDeleteStepClick(step);
        }
    }

    stepClicked(step:StepInfo, e:Event) {
        e.stopPropagation(); // Don't bubble up to parent

        const {onStepSelected} = this.props;

        if (step !== this.state.selectedStep) {
            this.setState({selectedStep: step});
            if (onStepSelected) {
                onStepSelected(step);
            }
        }
    }

    addStepClicked() {
        const {onAddStepClick} = this.props;
        if (onAddStepClick) {
            onAddStepClick();
        }
    }

    addChildStepClicked(parent:StepInfo, e:Event) {
        e.stopPropagation(); // Don't bubble up to parent
        const {onAddChildStepClick} = this.props;
        if (onAddChildStepClick) {
            onAddChildStepClick(parent);
        }
    }

    render() {

        const {steps} = this.props;
        const {selectedStep} = this.state;

        return (
            <div className="editor-steps">
                { steps.map(step => this.renderStep(step, selectedStep)) }
                <span className="add-step-button" onClick={() => this.addStepClicked()}>
                    <svg width="24" height="24">
                        <g transform="translate(12,12)">{ getAddIconGroup(12) }</g>
                    </svg>
                    Add step
                </span>
            </div>
        );
    }
}

