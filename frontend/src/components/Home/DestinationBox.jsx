import React, { useState } from 'react';
import italyImg from '../../assets/italy.png';
import parisImg from '../../assets/paris.png';
import usaImg from '../../assets/usa.png';

export default function DestinationBox(){
    return(
        <div className="bg-gray-100 pb-16 py-8">
      <div className="text-center mb-8">
        <p className="text-gray-500 text-lg">✦ Get To Know Us</p>
        <h1 className="text-4xl font-bold">Top Destinations</h1>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 ">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <img src={italyImg} alt="Rome, Italy" className="w-full h-64 object-cover" />
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Rome, Italy</h2>
              <p className="text-gray-500">$0</p>
            </div>
            <p className="mt-2 flex items-center text-gray-600">
              <span className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="icon icon-tabler icons-tabler-filled icon-tabler-location"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M20.891 2.006l.106 -.006l.13 .008l.09 .016l.123 .035l.107 .046l.1 .057l.09 .067l.082 .075l.052 .059l.082 .116l.052 .096c.047 .1 .077 .206 .09 .316l.005 .106c0 .075 -.008 .149 -.024 .22l-.035 .123l-6.532 18.077a1.55 1.55 0 0 1 -1.409 .903a1.547 1.547 0 0 1 -1.329 -.747l-.065 -.127l-3.352 -6.702l-6.67 -3.336a1.55 1.55 0 0 1 -.898 -1.259l-.006 -.149c0 -.56 .301 -1.072 .841 -1.37l.14 -.07l18.017 -6.506l.106 -.03l.108 -.018z" />
                </svg>
              </span>
              4 Days
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <img src={parisImg} alt="Paris, France" className="w-full h-64 object-cover" />
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Paris, France</h2>
              <p className="text-gray-500">$0</p>
            </div>
            <p className="mt-2 flex items-center text-gray-600">
              <span className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="icon icon-tabler icons-tabler-filled icon-tabler-location"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M20.891 2.006l.106 -.006l.13 .008l.09 .016l.123 .035l.107 .046l.1 .057l.09 .067l.082 .075l.052 .059l.082 .116l.052 .096c.047 .1 .077 .206 .09 .316l.005 .106c0 .075 -.008 .149 -.024 .22l-.035 .123l-6.532 18.077a1.55 1.55 0 0 1 -1.409 .903a1.547 1.547 0 0 1 -1.329 -.747l-.065 -.127l-3.352 -6.702l-6.67 -3.336a1.55 1.55 0 0 1 -.898 -1.259l-.006 -.149c0 -.56 .301 -1.072 .841 -1.37l.14 -.07l18.017 -6.506l.106 -.03l.108 -.018z" />
                </svg>
              </span>
              8 Days
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <img src={usaImg} alt="New York, USA" className="w-full h-64 object-cover" />
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">New York, USA</h2>
              <p className="text-gray-500">$0</p>
            </div>
            <p className="mt-2 flex items-center text-gray-600">
              <span className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="icon icon-tabler icons-tabler-filled icon-tabler-location"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M20.891 2.006l.106 -.006l.13 .008l.09 .016l.123 .035l.107 .046l.1 .057l.09 .067l.082 .075l.052 .059l.082 .116l.052 .096c.047 .1 .077 .206 .09 .316l.005 .106c0 .075 -.008 .149 -.024 .22l-.035 .123l-6.532 18.077a1.55 1.55 0=" />
                </svg>
              </span>
              7 Days
            </p>
          </div>
        </div>
      </div>
    </div>
    )
}