export interface ApiConfig {
    baseUrl: string
}

export interface ObservabilityConfig {
    connectionString: string
}

export interface AppConfig {
    api: ApiConfig
    observability: ObservabilityConfig
}

const config: AppConfig = {
    api: {
        baseUrl: '/api'
    },
    observability: {
        connectionString: process.env.REACT_APP_APPLICATIONINSIGHTS_CONNECTION_STRING || ''
    }
}

export default config;