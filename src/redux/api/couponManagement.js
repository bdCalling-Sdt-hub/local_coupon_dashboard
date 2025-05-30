import { baseApi } from "./baseApi";

const couponManagement = baseApi.injectEndpoints({
    endpoints : (builder)=>({
        getAllCoupon : builder.query({
            query : (page)=>{
                return {
                    url : `/coupons?page=${page}&limit=10`,
                    method : "GET"
                }
            },
            providesTags : ['coupons']
        }),
        businessAnalytics : builder.query({
            query : ()=>{
                return {
                    url : '/home/analytics',
                    method : 'GET'
                }
            }
        }),
        addNewCoupons : builder.mutation({
            query : (data)=>{
                return {
                    url : '/coupons',
                    method : 'POST',
                    body : data
                }
            },
            invalidatesTags : ["coupons"]
        }),
        deleteCoupons : builder.mutation({
            query : (id)=>{
                return {
                    url : `/coupons?id=${id}`,
                    method : "DELETE"
                }
            },
            invalidatesTags : ["coupons"]
        }),
        getAllReport : builder.query({
            query : ()=>{
                return { 
                    url : `/admin/report?page=1&limit=1000`,
                    method : 'GET'
                }
            }
        }),
        getSingleCoupon : builder.query({
            query : (id)=>{
                return  {
                    url : `/coupons/get?id=${id}`,
                    method : 'GET'
                }
            }
        }),
        editCoupons : builder.mutation({
            query : (data)=>{
                return {
                    url : '/coupons',
                    method : "PATCH",
                    body : data
                }
            },
            invalidatesTags : ["coupons"]
        })
    })
})

export const { useGetAllCouponQuery , useBusinessAnalyticsQuery , useAddNewCouponsMutation , useDeleteCouponsMutation , useGetAllReportQuery , useGetSingleCouponQuery , useEditCouponsMutation} = couponManagement;