/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import OriginalDocPaginator from '@theme-original/DocPaginator';
import { DiscussionEmbed } from 'disqus-react';
import React from 'react';

export default function DocPaginator(props) {
    const fmtId = location.href.replace(/^\//, '').replace(/[\s\/]/gi, '-');
    const disqusId = fmtId == '' ? 'main' : fmtId;

    return (
        <>
            <OriginalDocPaginator {...props} />
            <br/>
            <DiscussionEmbed
                shortname='kmm-icerock-dev'
                config={{
                    url: location.href,
                    identifier: disqusId,
                }}
            />
        </>
    );
}
