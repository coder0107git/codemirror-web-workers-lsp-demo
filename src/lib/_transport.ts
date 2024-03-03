import { Transport } from "@open-rpc/client-js/src/transports/Transport";
import { getNotifications } from "@open-rpc/client-js/src/Request";
import type { JSONRPCRequestData, IJSONRPCData } from "@open-rpc/client-js/src/Request";

export default class PostMessageWorkerTransport extends Transport {
	public worker: Worker;
	public postMessageID: string;

	constructor(worker: Worker) {
		super();
		this.worker = worker;
		this.postMessageID = `post-message-transport-${Math.random()}`;
	}

	private messageHandler = (ev: MessageEvent) => {
		console.log("LSP <<-", ev.data);
		this.transportRequestManager.resolveResponse(JSON.stringify(ev.data));
	};

	public connect(): Promise<void> {
		return new Promise(async (resolve, reject) => {
			this.worker.addEventListener("message", this.messageHandler);
			resolve();
		});
	}

	public async sendData(data: JSONRPCRequestData, timeout: number | null = 5000): Promise<any> {
		console.log("LSP ->>", data);
		const prom = this.transportRequestManager.addRequest(data, null);
		const notifications = getNotifications(data);
		if (this.worker) {
			this.worker.postMessage((data as IJSONRPCData).request);
			this.transportRequestManager.settlePendingRequest(notifications);
		}
		return prom;
	}

	public close(): void {
		this.worker.terminate();
	}
}
