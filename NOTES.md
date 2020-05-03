# Arguments

When you pass arguments with \$ sign you need to enclose with ' eg:

```sh
# For NODEJS:
nexss $# --x='${process.env.NEXSS_CACHE_PATH}'

# SPECIFIC NEXSS
# ???? :env
nexss $# --x='${e:NEXSS_CACHE_PATH}'
```
