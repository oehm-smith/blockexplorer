import React, {useContext, useEffect, useRef} from "react"
import {
    createColumnHelper, flexRender, getCoreRowModel, useReactTable, PaginationState,
    ColumnDef
} from "@tanstack/react-table"
import {DispatchContext, StateContext} from "./AppContext"
import {age, hexToDecimal, numberFormat, succinctise} from "./utils"
import {QueryClient, QueryClientProvider, useQuery} from '@tanstack/react-query'
import {Alchemy} from "alchemy-sdk"

/**
 *
 * @param options - options: {
 *     pageIndex, pageSize
 * }
 * @return {Promise<{pageCount: number, rows: *}>}
 */
function getFetchData(data) {
    return async function fetchData(options) {
        // Simulate some network latency
        // await new Promise(r => setTimeout(r, 500))

        return {
            rows: data.slice(
                options.pageIndex * options.pageSize,
                (options.pageIndex + 1) * options.pageSize
            ),
            pageCount: Math.ceil(data.length / options.pageSize),
        }
    }
}

const queryClient = new QueryClient()

export function TransactionsTableRender({columns, inputData}) {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const alchemy = new Alchemy(state.settings);

    const [{pageIndex, pageSize, transactionIndex}, setPagination] =
        React.useState({
            pageIndex: 0,
            pageSize: 10,
            transactionIndex: 0
        })
    const pageIndexRef = useRef();  // save the previous value of pageIndex

    // function usePrevious(value) {
    //     const ref = useRef();
    //     useEffect(() => {
    //         ref.current = value;
    //     });
    //     return ref.current;
    // }

    // const [trxGenerator, setTrxGenerator] = React.useState(()=>Promise.resolve({hash:'dummy tx generated'}))

    useEffect(() => {
        console.log(`useEffect for state.blockTransactions - length: ${state.blockTransactions.length}`)
        //     setTrxGenerator(async () => {
        //         console.log(`getNext`)
        //         return [await alchemy.transact.getTransaction("0x55be2d4dea9f7d324f0c64ebbd6f62281a434302076570c1db2d0283a7d92a28")]
        //     })
        //     // setTrxGenerator(getNext)
    }, [state.blockTransactions])

    const fetchDataOptions = {
        pageIndex,
        pageSize,
        transactionIndex,
    }

    // const fetchData = getFetchData(inputData)

    const getSomething = async () => {
        const item = await alchemy.transact.getTransaction("0x55be2d4dea9f7d324f0c64ebbd6f62281a434302076570c1db2d0283a7d92a28")
        return [item, item]
    }

    const calculateFirstTransaction = options => {
        return options.pageSize * options.pageIndex;    // + options.transactionIndex
    }

    const calculateLastTransaction = options => {
        return Math.min(options.pageSize * (options.pageIndex + 1), state.blockTransactions.length - 1)
    }
    /**
     *
     * @param options - options.transactionIndex in 0 .. state.blockTransactions.length
     * options.pageSize and pageIndex - offset into transactionIndex
     * @return {Promise<Awaited<*>|Awaited<*[]>>}
     */
    const getTransaction = async (options) => {
        if (state.blockTransactions.length == 0) {
            console.log(`getTransaction - blockTransactions.length == 0`)
            return Promise.resolve([])
        }
        let done = false;
        let wait = false;
        // const transactions = [];
        const startPossibleIndex = calculateFirstTransaction(options)
        const endPossibleIndex = calculateLastTransaction(options)
        console.log(`getTransaction - transactionIndex: ${options.transactionIndex}, startPossibleIndex: ${startPossibleIndex}, endPossibleIndex: ${endPossibleIndex}, blockTransactions.length: ${state.blockTransactions.length}`)
        if (options.transactionIndex >= startPossibleIndex && options.transactionIndex < endPossibleIndex) {
            while (!done || wait) {
                try {
                    if (!wait) {
                        console.log(`  getTransaction - lookup: ${JSON.stringify(options)} - ${state.blockTransactions[options.transactionIndex]}`)
                        const transaction = await alchemy.transact.getTransaction(state.blockTransactions[options.transactionIndex]);
                        transaction.transactionNumber = options.transactionIndex;
                        // i += 1;
                        dispatch({type: 'appendWithTransaction', payload: transaction})
                        // transactions.push(transaction);
                        setPagination({
                            pageIndex: options.pageIndex,
                            pageSize: options.pageSize,
                            transactionIndex: options.transactionIndex + 1
                        })
                        done = true;
                    }
                } catch (e) {
                    console.error(`Error getting transaction - ${e}`)
                    wait = true;
                    setTimeout(() => wait = false, 1000)
                }
            }
        }
        return Promise.resolve(state.transactions)
    }

    const dataQuery = useQuery({
        queryKey: ['data', fetchDataOptions],
        // queryFn: () => getSomething(),    //getTransaction(fetchDataOptions),
        queryFn: () => getTransaction(fetchDataOptions),
        keepPreviousData: true
    })

    const defaultData = React.useMemo(() => [], [])

    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
            transactionIndex,
        }),
        [pageIndex, pageSize, transactionIndex]
    )

    const table = useReactTable({
        data: dataQuery.data ?? defaultData,
        columns,
        pageCount: Math.ceil(state.blockTransactions.length / pageSize),   //dataQuery.data?.pageCount ?? -1,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        // getPaginationRowModel: getPaginationRowModel(), // If only doing manual pagination, you don't need this
        debugTable: true,
    })

    useEffect(() => {
        console.log(`table state pagination updated: ${JSON.stringify(table.getState().pagination)}`)
        // only want to update if the pageIndex has changed
        if (pageIndexRef.current !== table.getState().pagination.pageIndex) {
            const newTransactionIndex = calculateFirstTransaction(fetchDataOptions)
            console.log(`changed transactionIndex to ${newTransactionIndex}`)
            const updatedPagination = {...table.getState().pagination, transactionIndex: newTransactionIndex}
            setPagination(updatedPagination)
            pageIndexRef.current = table.getState().pagination.pageIndex
        }
    }, [table.getState().pagination])

    const cellAlignment = (id) => {
        const items = id.split('_');
        const name = items[items.length - 1]
        const aligns = {
            'gasLimit': 'right',
            'gasUsed': 'right',
            'value': 'right'
        }
        switch (name) {
            case 'gasLimit':
            case 'gasPrice':
            case 'value':
                return 'Align-' + aligns[name]
            default:
                return 'Align-left'
        }
    }

    const hasClickHandler = id => {
        const items = id.split('_');
        const name = items[items.length - 1]
        switch (name) {
            case 'transactionNumber':
                return true
            default:
                return false
        }
    }
    const onClickHandler = (cell) => {
        const items = cell.id.split('_');
        const name = items[items.length - 1]
        switch (name) {
            case 'transactionNumber':
                dispatch({type: 'setSelectedTransactions', payload: cell.getValue()})
            default:
                return undefined
        }
    }

    const updateTransactionIndex = () => {
        // const newTransactionIndex = calculateFirstTransaction(fetchDataOptions)
        // const updatedOptions = {...table.getState().pagination, transactionIndex: newTransactionIndex}
        // setPagination(updatedOptions)
    }

    const setPageIndex = page => {
        dispatch({type: 'clearTransactions'})
        table.setPageIndex(page)
        updateTransactionIndex()
    }

    const previousPage = () => {
        dispatch({type: 'clearTransactions'})
        table.previousPage()
        updateTransactionIndex()
    }

    const nextPage = () => {
        dispatch({type: 'clearTransactions'})
        table.nextPage()
        updateTransactionIndex()
    }

    /*if (! (dataQuery.data )) {
        return (
            <ul><li>Nothing yet</li></ul>
        )
    } else {
        return (
            <ul>
                {dataQuery.data.map(x => (
                    <li key={Math.random() * 100}>{JSON.stringify(x)}</li>
                ))}
            </ul>
        )
    }*/
    /*
      Render the UI for your table
      - react-table doesn't have UI, it's headless. We just need to put the react-table props from the Hooks, and it will do its magic automatically*/

    return (
        <div className="p-2">
            <table className="transactionsTable">
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => {
                            if (hasClickHandler(cell.id)) {
                                return (
                                    <td key={cell.id} className={cellAlignment(cell.id)}>
                                        <button onClick={() => onClickHandler(cell)}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </button>
                                    </td>
                                )
                            } else {
                                return (
                                    <td key={cell.id} className={cellAlignment(cell.id)}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                )

                            }
                        })}
                    </tr>
                ))}
                </tbody>
                <tfoot>
                {table.getFooterGroups().map(footerGroup => (
                    <tr key={footerGroup.id}>
                        {footerGroup.headers.map(header => (
                            <th key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.footer,
                                        header.getContext()
                                    )}
                            </th>
                        ))}
                    </tr>
                ))}
                </tfoot>
            </table>
            <div className="h-2"/>
            <div className="flex items-center gap-2">
                <button
                    className="border rounded p-1"
                    onClick={() => setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>
                <span className="flex items-center gap-1">
                        <span>Page</span>
                        <strong>
                            {table.getState().pagination.pageIndex + 1} of{' '}
                            {table.getPageCount()}
                        </strong>
                </span>
                <span className="flex items-center gap-1">
          | Go to page:
          <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  setPageIndex(page)
                  // table.setPageIndex()
              }}
              className="border p-1 rounded w-16"
          />
        </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
            <div>{table.getRowModel().rows.length} Rows {dataQuery.isFetching ? '(Loading...)' : null}</div>
        </div>
    )
}

export function TransactionsTable() {   //{ transactions }) {
    const state = useContext(StateContext);

    const columnHelper = createColumnHelper()

    const columns = [
        columnHelper.accessor('transactionNumber', {
            header: () => <span>#</span>,
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('hash', {
            cell: info => succinctise(info.getValue()),
        }),
        columnHelper.accessor('blockNumber', {
            cell: info => numberFormat(info.getValue()),
            header: () => <span>block<br/>number</span>,
        }),
        columnHelper.accessor('timestamp', {
            header: () => 'age',
            cell: info => age(info.getValue()),
        }),
        columnHelper.accessor('gasLimit', {
            header: () => <span>gasLimit</span>,
            cell: info => numberFormat(info.getValue())
        }),
        columnHelper.accessor('gasPrice', {
            header: 'gasPrice',
            cell: info => numberFormat(info.getValue())
        }),
        columnHelper.accessor('from', {
            header: 'from',
            cell: info => succinctise(info.getValue()),
        }),
        columnHelper.accessor('to', {
            header: 'to',
            cell: info => succinctise(info.getValue()),
        }),
        columnHelper.accessor('value', {
            header: 'value',
            cell: info => numberFormat(hexToDecimal(info.getValue()._hex))
        }),
    ]

    if (state.blockTransactions.length === 0) {
        return (
            <>Click #transactions on Latest Blocks</>
        )
    }
    return (
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <TransactionsTableRender columns={columns}/>
                {/*inputData={transactions}/>*/}
            </QueryClientProvider>
        </React.StrictMode>
    )
}
