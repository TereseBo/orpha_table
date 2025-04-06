import Link from "next/link"
import { ArrowBigRightDash } from "lucide-react"

export function Nav({ href, label, className }) {

    return (
        <nav >
            <Link className={`${className} z-100 inline-flex items-center underline underline-offset-4 hover:text-sky-700`} href={href}>{label} <ArrowBigRightDash /></Link>
        </nav>)

}