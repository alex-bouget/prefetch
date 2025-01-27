# Prefetch

Prefetch is an extensions for navigator (firefox/chromium [tested only on chrome]) who can modify request and response with predefined rule by this extensions.

The settings is a list of config

```
interface PrefetchConfig {
    urls: string[], // Url of website where this config will be activated, in regex
    modified: string[], // Url of fetch where the rules will be executed
    rules: PrefetchRule[], // List of rules to execute, in order
}

interface PrefetchRule {
    type: string, // name of the rule who will be execute
    data: any, // parameters for the rule
}
```

An exemple of settings (see the modification on <https://en.wikipedia.org/wiki/YouTube> and hover on the link `social media`)

```json5
[
    {
        "urls": ["https:\/\/en\\.wikipedia\\.org.*"], // All wikipedia en
        "modified": [".*\/summary\/Social_media$"], // Modify the fetch of social media
        "rules": [
            {
                "type":"response_json_modifier",
                "data": {
                    "to": null,
                    "data": {
                        "extract_html": "<p><b>Social media</b> like github.com is funny</p>"
                    }
                }
            }
        ]
    }
]
```

Current rules:

`response_json_modifier`: read response as json and append data on it
- `on failed`: Don't append and return the data as get by the fetch
- `data`:
    - `to` is the json path to the place where you want to add your data. if it's null, append to the root of the json
    - `source`: Data to fetch and add to the first fetch. :warning: this fetch is not modifiable, it's a direct fetch
    - `data`: use only if you don't add `source`, the data to add

`request_json_modifier`: Same as `response_json_modifier` but for the body of the request