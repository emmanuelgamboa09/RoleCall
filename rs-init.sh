#!/bin/bash

mongo <<EOF
var config = {
    "_id": "ReplSet",
    "version": 1,
    "members": [
        {
            "_id": 1,
            "host": "localhost:27017",
        },
    ]
};
rs.initiate(config, { force: true });
rs.status();
EOF