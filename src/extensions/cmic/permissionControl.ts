import { useSettingStore } from '@/stores/settingStore'

import { ComfyApp, app } from '../../scripts/app'

app.registerExtension({
  name: 'TestExtension1',
  commands: [
    {
      id: 'foo-id',
      label: 'foo',
      function: () => {
        alert(1)
      }
    }
  ],
  menuCommands: [
    {
      path: ['ext', 'ext2'],
      commands: ['foo-id']
    }
  ],
  setup(app: ComfyApp): Promise<void> | void {
    //app的bodyLeft和bodyRight是一个div，从这个div中搜索comfy-settings-btn并删除
    useSettingStore().isShowSettingButton = false
  }
})
