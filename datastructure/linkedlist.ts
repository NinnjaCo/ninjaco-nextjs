/**
 * @description Node
 * @class Node
 * @template T
 * @property {T} data
 */
export class Node<T> {
  data: T
  next: Node<T> | null
  constructor(data: T) {
    this.data = data
    this.next = null
  }
}

/**
 * @description Linked List
 * @class LinkedList
 * @template T
 * @property {Node<T> | null} head
 */
export class LinkedList<T> {
  head: Node<T> | null
  tail: Node<T> | null
  length: number
  constructor() {
    this.head = null
    this.tail = null
    this.length = 0
  }

  /**
   * @description append to the end of the list, O(1)
   * @param data
   * @memberof LinkedList
   * @returns {void}
   */
  append(data: T) {
    const node = new Node(data)
    if (this.head === null) {
      this.head = node
      this.tail = node
    } else {
      this.tail!.next = node
      this.tail = node
    }
    this.length++
  }

  /**
   * @description prepend to the beginning of the list, O(1)
   * @param data
   * @memberof LinkedList
   * @returns {void}
   */
  prepend(data: T) {
    const node = new Node(data)
    if (this.head === null) {
      this.head = node
      this.tail = node
    } else {
      node.next = this.head
      this.head = node
    }
    this.length++
  }

  /**
   * @description insert at a specific index, O(n)
   * @param index
   * @param data
   * @memberof LinkedList
   * @returns {void}
   */
  insert(index: number, data: T) {
    if (index >= this.length) {
      return this.append(data)
    }
    const node = new Node(data)
    const leader = this.traverseToIndex(index - 1)
    const holdingPointer = leader!.next
    leader!.next = node
    node.next = holdingPointer
    this.length++
  }

  /**
   * @description traverse to a specific index, O(n)
   * @param index
   * @returns {Node<T>}
   */
  traverseToIndex(index: number) {
    let counter = 0
    let currentNode = this.head
    while (counter !== index) {
      currentNode = currentNode!.next
      counter++
    }
    return currentNode
  }

  /**
   * @description remove at a specific index, O(n)
   * @param index
   * @memberof LinkedList
   * @returns {void}
   */
  remove(index: number) {
    if (index >= this.length) {
      return
    }
    const leader = this.traverseToIndex(index - 1)
    const unwantedNode = leader!.next
    leader!.next = unwantedNode!.next
    this.length--
  }

  /**
   * @description reverse the list, O(n)
   * @memberof LinkedList
   * @returns {void}
   */
  printList() {
    const array: T[] = []
    let currentNode = this.head
    while (currentNode !== null) {
      array.push(currentNode.data)
      currentNode = currentNode.next
    }
    return array
  }
}
