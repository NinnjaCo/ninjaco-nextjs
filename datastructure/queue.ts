// Implement a queue using a linked list

import { LinkedList } from './linkedlist'

/**
 * @description Queue
 *  - FIFO
 * @class Queue
 * @template T
 * @property {LinkedList<T>} list
 * @property {number} length
 */
export class Queue<T> {
  private list: LinkedList<T>
  private length: number
  constructor() {
    this.list = new LinkedList()
    this.length = 0
  }

  /**
   * @description Clear the queue
   * @memberof Queue
   * @returns {void}
   * @time O(1)
   * @space O(1)
   */
  clear(): void {
    this.list.clear()
    this.length = 0
  }

  /**
   * @description get size
   * @memberof Queue
   * @returns {number}
   * @time O(1)
   * @space O(1)
   */
  size(): number {
    return this.length
  }

  /**
   * @description enqueue
   * @param data
   * @memberof Queue
   * @returns {void}
   * @time O(1)
   * @space O(1)
   */
  enqueue(data: T) {
    this.list.append(data)
    this.length++
  }

  /**
   * @description dequeue
   * @memberof Queue
   * @returns {T | null}
   * @time O(1)
   * @space O(1)
   * @note
   * - if the list is empty, return null
   * - if the list has only one node, set both head and tail to null
   * - if the list has more than one node, set head to the next node
   * - decrement the length
   * - return the data of the node
   */
  dequeue(): T | null {
    if (this.length === 0) return null
    const data = this.list.head!.data
    if (this.length === 1) {
      this.list.head = null
      this.list.tail = null
    } else {
      this.list.head = this.list.head!.next
    }
    this.length--
    return data
  }

  /**
   * @description peek
   * @memberof Queue
   * @returns {T | null}
   * @time O(1)
   * @space O(1)
   */
  peek(): T | null {
    return this.list.head ? this.list.head.data : null
  }

  /**
   * @description isEmpty
   * @memberof Queue
   * @returns {boolean}
   * @time O(1)
   * @space O(1)
   */
  isEmpty(): boolean {
    return this.length === 0
  }
}
