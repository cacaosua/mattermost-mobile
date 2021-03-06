// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {capitalize, getRandomId} from '@support/utils';

import client from './client';
import {getResponseFromError} from './common';

// ****************************************************************
// Channels
// See https://api.mattermost.com/#tag/channels
//
// Exported API function should have the following:
// - documented using JSDoc
// - meaningful description
// - match the referenced API endpoints
// - parameter/s defined by `@param`
// - return value defined by `@return`
// ****************************************************************

/**
 * Add user to channel.
 * See https://api.mattermost.com/#operation/AddChannelMember
 * @param {string} userId - The ID of user to add into the channel
 * @param {string} channelId - The channel ID
 * @return {Object} returns {member} on success or {error, status} on error
 */
export const apiAddUserToChannel = async (userId, channelId) => {
    try {
        const response = await client.post(
            `/api/v4/channels/${channelId}/members`,
            {user_id: userId},
        );

        return {member: response.data};
    } catch (err) {
        return getResponseFromError(err);
    }
};

/**
 * Create a channel.
 * See https://api.mattermost.com/#operation/CreateChannel
 * @param {string} option.teamId - The team ID of the team to create the channel on
 * @param {string} option.type - 'O' (default) for a public channel, 'P' for a private channel
 * @param {string} option.prefix - option to add prefix to name and display name
 * @param {Object} option.channel - fix channel object to be created
 * @return {Object} returns {channel} on success or {error, status} on error
 */
export const apiCreateChannel = async ({teamId = null, type = 'O', prefix = 'channel', channel = null} = {}) => {
    try {
        const response = await client.post(
            '/api/v4/channels',
            channel || generateRandomChannel(teamId, type, prefix),
        );

        return {channel: response.data};
    } catch (err) {
        return getResponseFromError(err);
    }
};

/**
 * Create a direct message channel.
 * See https://api.mattermost.com/#operation/CreateDirectChannel
 * @param {Array} userIds - the two user IDs to be in the direct message
 * @return {Object} returns {channel} on success or {error, status} on error
 */
export const apiCreateDirectChannel = async (userIds = []) => {
    try {
        const response = await client.post(
            '/api/v4/channels/direct',
            userIds,
        );

        return {channel: response.data};
    } catch (err) {
        return getResponseFromError(err);
    }
};

/**
 * Create a group message channel.
 * See https://api.mattermost.com/#operation/CreateGroupChannel
 * @param {Array} userIds - user IDs to be in the group message channel
 * @return {Object} returns {channel} on success or {error, status} on error
 */
export const apiCreateGroupChannel = async (userIds = []) => {
    try {
        const response = await client.post(
            '/api/v4/channels/group',
            userIds,
        );

        return {channel: response.data};
    } catch (err) {
        return getResponseFromError(err);
    }
};

/**
 * Remove user from channel.
 * See https://api.mattermost.com/#operation/RemoveUserFromChannel
 * @param {string} channelId - The channel ID
 * @param {string} userId - The user ID to be removed from channel
 * @return {Object} returns {status} on success or {error, status} on error
 */
export const apiDeleteUserFromChannel = async (channelId, userId) => {
    try {
        const response = await client.delete(
            `/api/v4/channels/${channelId}/members/${userId}`,
        );

        return {status: response.status};
    } catch (err) {
        return getResponseFromError(err);
    }
};

/**
 * Get a channel by name.
 * See https://api.mattermost.com/#operation/GetChannelByName
 * @param {string} teamId - team ID
 * @param {string} channelName - channel name
 * @return {Object} returns {channel} on success or {error, status} on error
 */
export const apiGetChannelByName = async (teamId, channelName) => {
    try {
        const response = await client.get(`/api/v4/teams/${teamId}/channels/name/${channelName}`);

        return {channel: response.data};
    } catch (err) {
        return getResponseFromError(err);
    }
};

/**
 * Get a channel by name and team name.
 * See https://api.mattermost.com/#operation/GetChannelByNameForTeamName
 * @param {string} teamName - team name
 * @param {string} channelName - channel name
 * @return {Object} returns {channel} on success or {error, status} on error
 */
export const apiGetChannelByNameAndTeamName = async (teamName, channelName) => {
    try {
        const response = await client.get(`/api/v4/teams/name/${teamName}/channels/name/${channelName}`);

        return {channel: response.data};
    } catch (err) {
        return getResponseFromError(err);
    }
};

/**
 * Get channels for user.
 * See https://api.mattermost.com/#operation/GetChannelsForTeamForUser
 * @param {string} userId - The user ID
 * @param {string} teamId - The team ID the user belongs to
 * @return {Object} returns {channels} on success or {error, status} on error
 */
export const apiGetChannelsForUser = async (userId, teamId) => {
    try {
        const response = await client.get(`/api/v4/users/${userId}/teams/${teamId}/channels`);

        return {channels: response.data};
    } catch (err) {
        return getResponseFromError(err);
    }
};

function generateRandomChannel(teamId, type, prefix) {
    const randomId = getRandomId();

    return {
        team_id: teamId,
        name: `${prefix}-${randomId}`,
        display_name: `${capitalize(prefix)} ${randomId}`,
        type,
        purpose: `Channel purpose: ${prefix} ${randomId}`,
        header: `Channel header: ${prefix} ${randomId}`,
    };
}

export const Channel = {
    apiAddUserToChannel,
    apiCreateChannel,
    apiCreateDirectChannel,
    apiCreateGroupChannel,
    apiDeleteUserFromChannel,
    apiGetChannelByName,
    apiGetChannelsForUser,
};

export default Channel;
