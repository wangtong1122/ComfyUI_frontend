import type { ComfyApp } from '@/scripts/app'

import { $el } from '../../ui'
import { ComfyButtonGroup } from '../components/buttonGroup'
import './menu.css'

// Export to make sure following components are shimmed and exported by vite
export { ComfyButton } from '../components/button'
export { ComfySplitButton } from '../components/splitButton'
export { ComfyPopup } from '../components/popup'
export { ComfyAsyncDialog } from '@/scripts/ui/components/asyncDialog'
export { DraggableList } from '@/scripts/ui/draggableList'
export { applyTextReplacements, addStylesheet } from '@/scripts/utils'

export class ComfyAppMenu {
  app: ComfyApp
  actionsGroup: ComfyButtonGroup
  settingsGroup: ComfyButtonGroup
  viewGroup: ComfyButtonGroup
  element: HTMLElement

  constructor(app: ComfyApp) {
    this.app = app

    // Keep the group as there are custom scripts attaching extra
    // elements to it.
    this.actionsGroup = new ComfyButtonGroup()
    this.settingsGroup = new ComfyButtonGroup()
    this.viewGroup = new ComfyButtonGroup()

    this.element = $el('div.flex.gap-2.mx-2', [
      this.actionsGroup.element,
      this.settingsGroup.element,
      this.viewGroup.element
    ])

    //监听元素的变化
    // // Setup MutationObserver to watch for new elements
    // const observer = new MutationObserver((mutations) => {
    //   mutations.forEach((mutation) => {
    //   if (mutation.type === 'childList') {
    //   // Handle new elements here
    //   mutation.addedNodes.forEach(node => {
    //   console.log('New element added:', node);
    //   });
    //   }
    //   });
    // });

    // // Start observing the element
    // observer.observe(this.element, {
    //   childList: true, // Watch for changes in child elements
    //   subtree: false   // Only watch direct children
    // });
  }
}
