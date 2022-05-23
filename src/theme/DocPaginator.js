/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import OriginalDocPaginator from '@theme-original/DocPaginator';
import { DiscussionEmbed } from 'disqus-react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import React from 'react';

export default function DocPaginator(props) {
    return (
        <>
            <OriginalDocPaginator {...props} />
            <br/>
            <BrowserOnly>
                { () => {
                    const fmtId = window.location.href.replace(/^\//, '').replace(/[\s\/]/gi, '-');
                    const disqusId = fmtId == '' ? 'main' : fmtId;
                    <DiscussionEmbed
                        shortname='kmm-icerock-dev'
                        config={{
                            url: window.location.href,
                            identifier: disqusId,
                        }}
                    />
                }}
            </BrowserOnly>
        </>
    );
}
