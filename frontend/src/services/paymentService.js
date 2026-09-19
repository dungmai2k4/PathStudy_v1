import api from './api';

export const paymentService = {
  /**
   * Tạo đơn hàng thanh toán qua VietQR
   * @param {string} planCode Mã gói (ví dụ: 'PRO_MONTHLY', 'PRO_YEARLY')
   * @returns {Promise<any>}
   */
  async createVietQROrder(planCode) {
    const response = await api.post('/api/v1/payments/orders', { planCode });
    return response.data.data;
  },

  /**
   * Tra cứu trạng thái đơn hàng (dùng cho Polling)
   * @param {string} orderCode Mã đơn hàng (ví dụ: 'PS123456')
   * @returns {Promise<any>}
   */
  async getOrderDetails(orderCode) {
    const response = await api.get(`/api/v1/payments/orders/${orderCode}`);
    return response.data.data;
  },

  /**
   * Giả lập chuyển khoản thành công phục vụ kiểm thử Local
   * @param {string} orderCode Mã đơn hàng
   * @param {number} [amount] Tùy chọn số tiền chuyển
   * @returns {Promise<any>}
   */
  async simulatePaymentSuccess(orderCode, amount = null) {
    const payload = { orderCode };
    if (amount !== null && amount !== undefined) {
      payload.amount = amount;
    }
    const response = await api.post('/api/v1/payments/simulate-success', payload);
    return response.data.data;
  },

  /**
   * Lấy lịch sử các đơn hàng thanh toán của người dùng
   * @returns {Promise<Array<any>>}
   */
  async getMyOrders() {
    const response = await api.get('/api/v1/payments/my-orders');
    return response.data.data;
  },
};

export default paymentService;
