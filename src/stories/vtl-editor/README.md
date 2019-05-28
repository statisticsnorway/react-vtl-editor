# VtlEditor component

## Props

|      Props      |  Type  | Default value | Required | Description                          |
| :-------------: | :----: | :-----------: | :------: | ------------------------------------ |
|     grammar     | string |   "vtl-2.0"   |    -     | Grammar to control                   |
|      focus      |  bool  |     false     |    -     | Is the editor focus                  |
|      theme      | string |   "vs-dark"   |    -     | Editor theme                         |
|      value      | string |      " "      |          | Value of the editor                  |
|   handleValue   |  func  |       -       |    ✓     | Return the editor value              |
|   handleValid   |  func  |       -       |    ✓     | Return a boolean, value valid or not |
| showLineNumbers |  bool  |     false     |    -     | Are the line numbers displayed       |
|   showMinimap   |  bool  |     false     |    -     | Is the minimap displayed             |

## Styles

**VtlEditor** component has for class `vtl-editor`.
