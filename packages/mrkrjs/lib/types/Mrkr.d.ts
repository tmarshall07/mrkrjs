declare type OffsetProps = {
    startOffset?: number;
    endOffset?: number;
};
declare type DataProps = OffsetProps & {
    text: string;
    nodes: Text[];
};
interface Props {
    minimum?: number;
    maximum?: number;
    overlap?: boolean;
    selectionEnabled?: boolean;
    onSelection?: (e: PointerEvent, data: DataProps[]) => void;
}
export default class Mrkr {
    element: HTMLElement;
    highlightClass: string;
    maximum?: number;
    minimum?: number;
    overlap?: boolean;
    onSelection?: (e: PointerEvent, data: DataProps[]) => void;
    private selectionEnabled;
    constructor(element: HTMLElement, className: string, props?: Props);
    /**
     * Callback run on pointerup
     *
     * @private
     * @param {PointerEvent} event
     * @memberof Mrkr
     */
    private handlePointerUp;
    /**
     * Gets all nodes that have the current className
     *
     * @private
     * @returns {HTMLElement[]}
     * @memberof Mrkr
     */
    private getHighlightedNodes;
    /**
     * Creates a set of highlighted and non-highlighted nodes to replace the passed text content
     *
     * @private
     * @param {(string | null)} [text='']
     * @param {number} startOffset
     * @param {number} endOffset
     * @returns {ChildNode[]}
     * @memberof Mrkr
     */
    private highlightNode;
    /**
     * Converts relative range offset data to absolute offsets
     *
     * @private
     * @memberof Mrkr
     */
    private getAbsoluteOffsets;
    /**
     * Adds the event listener for pointerup
     *
     * @memberof Mrkr
     */
    private register;
    /**
     * Removes the event listener for pointerup
     *
     * @memberof Mrkr
     */
    private unregister;
    /**
     * Sets the current classname
     *
     * @param {string} className
     * @memberof Mrkr
     */
    setClassName(className: string): void;
    /**
     * Searches the container element for any highlighted nodes
     * according to the current className
     *
     * @param {string} [className] - optional classname, otherwise will check for this.highlightClass
     * @returns {DataProps[]}
     * @memberof Mrkr
     */
    getData(className?: string): DataProps[];
    /**
     * Sets the current container element
     *
     * @param {HTMLElement} element
     * @memberof Mrkr
     */
    setElement(element: HTMLElement): void;
    /**
     * Clears all or part of the highlighted text blocks
     *
     * @param {OffsetProps[]} [offsetTargets] - optional array of offsets to target and remove
     * @returns {void}
     * @memberof Mrkr
     */
    clear(offsetTargets?: OffsetProps[]): void;
    highlight(): DataProps[];
    /**
     * Highlights a range of text determined by start and end offsets
     *
     * @param {number} startOffset - absolute offset in the element container
     * @param {number} endOffset - absolute offset in the element container
     * @returns {DataProps[]}
     * @memberof Mrkr
     */
    highlightRange(startOffset: number, endOffset: number): DataProps[];
    getSelectionEnabled(): boolean;
    toggleSelection(isEnabled: boolean): void;
    enableSelection(): void;
    disableSelection(): void;
}
export {};
//# sourceMappingURL=Mrkr.d.ts.map