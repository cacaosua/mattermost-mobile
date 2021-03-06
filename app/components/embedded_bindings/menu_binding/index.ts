// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {connect} from 'react-redux';

import {GlobalState} from '@mm-redux/types/store';
import {ActionFunc, ActionResult, GenericAction} from '@mm-redux/types/actions';
import {DoAppCall, PostEphemeralCallResponseForPost} from 'types/actions/apps';
import {getPost} from '@mm-redux/selectors/entities/posts';

import MenuBinding from './menu_binding';
import {getChannel} from '@mm-redux/actions/channels';
import {getCurrentTeamId} from '@mm-redux/selectors/entities/teams';
import {doAppCall, postEphemeralCallResponseForPost} from '@actions/apps';

type OwnProps = {
    postId: string;
}

function mapStateToProps(state: GlobalState, ownProps: OwnProps) {
    return {
        post: getPost(state, ownProps.postId),
        currentTeamID: getCurrentTeamId(state),
    };
}

type Actions = {
    doAppCall: DoAppCall;
    getChannel: (channelId: string) => Promise<ActionResult>;
    postEphemeralCallResponseForPost: PostEphemeralCallResponseForPost;
}

function mapDispatchToProps(dispatch: Dispatch<GenericAction>) {
    return {
        actions: bindActionCreators<ActionCreatorsMapObject<ActionFunc>, Actions>({
            doAppCall,
            getChannel,
            postEphemeralCallResponseForPost,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuBinding);
