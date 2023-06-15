# Pippolina

Suggested pipeline

```yml
stages:
  - pipeline-dependencies

pippolina:
    stage: pipeline-dependencies
    image: registry.sandbox/pipeman/pippolina:latest

    script:
        - pippolina

    when: always

```